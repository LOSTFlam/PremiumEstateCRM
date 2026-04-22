/* eslint-disable import/named */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CommonForm from "components/commonForm";

describe("CommonForm", () => {
  it("supports the new form bag contract for module-driven fields", () => {
    const form = {
      values: { firstName: "Ada" },
      errors: { firstName: "Required" },
      touched: { firstName: true },
      handleChange: vi.fn(),
      handleBlur: vi.fn(),
      setFieldValue: vi.fn(),
    };

    render(
      <CommonForm
        moduleData={{
          fields: [{ name: "firstName", label: "First Name", type: "text", validation: [] }],
        }}
        form={form}
      />
    );

    const input = screen.getByLabelText("First Name");

    expect(input).toHaveValue("Ada");
    expect(screen.getByText("Required")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Grace" } });
    fireEvent.blur(input);

    expect(form.handleChange).toHaveBeenCalled();
    expect(form.handleBlur).toHaveBeenCalled();
  });
});
