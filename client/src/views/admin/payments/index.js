import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./paymentForm";
import Card from "components/card/Card";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import payImage from "assets/img/pay.avif";

const PUBLIC_KEY =
  "pk_test_51Nx0ulSFr3y25H3gtYaIaVQDwcMVg1USXhA8DCu2sApXlLDf6vhCRLqqBNj2gKoeO2O5SiF5SZ1zCukR1IMztGFK00WeIq8rz3";

const StripeContainer = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeLoadFailed, setStripeLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadStripe(PUBLIC_KEY)
      .then((stripe) => {
        if (!active) return;
        setStripePromise(stripe);
      })
      .catch(() => {
        if (!active) return;
        setStripeLoadFailed(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3}>
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <Card>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          ) : stripeLoadFailed ? (
            <Flex justifyContent="center" alignItems="center" height="200px">
              <Text color="gray.500">
                Payment system unavailable. Please check your connection.
              </Text>
            </Flex>
          ) : (
            <Flex justifyContent="center" alignItems="center" height="200px">
              <Text color="gray.500">Loading payment form…</Text>
            </Flex>
          )}
        </Card>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 6 }}>
        <Card>
          <Flex justifyContent={"center"} alignItems={"center"} height={"100%"} width={"100%"}>
            <img src={payImage} alt="" />
          </Flex>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default StripeContainer;
