const Invoice = require("../model/schema/invoice");
const Quote = require("../model/schema/quote");
const User = require("../model/schema/user");

const runPreSaveHooks = async (doc) => {
  doc.constructor.applySaveNormalization(doc);
  return doc;
};

describe("mongoose pre-save hooks", () => {
  it("normalizes invoice totals before save", async () => {
    const invoice = new Invoice({
      items: [{ quantity: 2, unitPrice: 100, discountPercent: 10, taxPercent: 5 }],
      discountPercent: 5,
      amountPaid: 25,
    });

    await runPreSaveHooks(invoice);

    expect(invoice.invoiceNumber).toMatch(/^INV-/);
    expect(invoice.subTotal).toBeGreaterThan(0);
    expect(invoice.amountDue).toBe(invoice.grandTotal - invoice.amountPaid);
  });

  it("normalizes quote totals before save", async () => {
    const quote = new Quote({
      subject: "Modernization quote",
      items: [{ quantity: 3, unitPrice: 50, discountPercent: 0, taxPercent: 10 }],
      adjustmentAmount: 20,
    });

    await runPreSaveHooks(quote);

    expect(quote.quoteNumber).toMatch(/^QT-/);
    expect(quote.subTotal).toBeGreaterThan(0);
    expect(quote.grandTotal).toBeGreaterThanOrEqual(quote.subTotal);
  });

  it("keeps backward-compatible user timestamps in sync", async () => {
    const user = new User({
      username: "architect@example.com",
      email: "architect@example.com",
      password: "strong-password",
    });

    await runPreSaveHooks(user);

    expect(user.createdDate).toBeInstanceOf(Date);
    expect(user.updatedDate).toBeInstanceOf(Date);
  });
});
