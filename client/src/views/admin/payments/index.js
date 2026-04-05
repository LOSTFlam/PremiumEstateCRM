import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./paymentForm";
import Card from "components/card/Card";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";

const PUBLIC_KEY =
  "pk_test_51Nx0ulSFr3y25H3gtYaIaVQDwcMVg1USXhA8DCu2sApXlLDf6vhCRLqqBNj2gKoeO2O5SiF5SZ1zCukR1IMztGFK00WeIq8rz3";

const stripePromise = loadStripe(PUBLIC_KEY).catch((error) => {
  console.warn("Stripe.js failed to load:", error.message);
  return null;
});

const StripeContainer = () => {
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <Card>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          ) : (
            <Flex justifyContent="center" alignItems="center" height="200px">
              <Text color="gray.500">Payment system unavailable. Please check your connection.</Text>
            </Flex>
          )}
        </Card>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <Card>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <img src={require("../../../assets/img/pay.avif")} />
          </Flex>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default StripeContainer;
