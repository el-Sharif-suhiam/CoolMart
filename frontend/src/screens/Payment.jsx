import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/utils/FormContainer";
import CheckoutSteps from "../components/UI/CheckoutSteps";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import { useGetStripeClientIdMutation } from "../slices/orderApiSlice";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// eslint-disable-next-line no-undef
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

function Payment() {
  const [clientSecret, setClientSecret] = React.useState("");
  const navigate = useNavigate();

  //get stripe client secret
  const [getStripeClientId, { isLoading, error }] =
    useGetStripeClientIdMutation();
  //////////////////////////////////////////////////////////////////////////
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const { cartItems } = cart;
  React.useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  React.useEffect(() => {
    const getClientId = async () => {
      const res = await getStripeClientId({ cartItems });
      const client = await res.data.clientSecret;
      setClientSecret(client);
    };
    getClientId();
  }, []);

  const options = { clientSecret };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error.data?.message || error.error || error.message}
        </Message>
      ) : (
        <div id="checkout">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </FormContainer>
  );
}

export default Payment;
