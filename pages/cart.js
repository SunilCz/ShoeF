import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import Wrapper from "@/components/Wrapper";
import CartItem from "@/components/CartItem";
import { useRouter } from "next/router";
import KhaltiCheckout from "khalti-checkout-web";
import { ESEWA_TEST_PID, ESEWA_URL, ESEWA_SCD } from "./config";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const router = useRouter();

  const subTotal = useMemo(() => {
    return cartItems.reduce((total, val) => total + val.attributes.price, 0);
  }, [cartItems]);

  const [loading, setLoading] = useState(false);

  const handleESewaPayment = () => {
    setLoading(true);

    // Prepare the payment payload for eSewa
    const payload = {
      amt: subTotal,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: subTotal,
      pid: ESEWA_TEST_PID,
      scd: ESEWA_SCD,
      su: "https://d2evy.csb.app/success",
      fu: "https://d2evy.csb.app/failed"
    };

    // Generate the eSewa payment URL
    const paymentUrl = `${ESEWA_URL}?pid=${payload.pid}&amt=${payload.amt}&psc=${payload.psc}&pdc=${payload.pdc}&txAmt=${payload.txAmt}&scd=${payload.scd}&su=${window.location.origin}/esewa-success&fu=${window.location.origin}/esewa-failed`;

    // Redirect to the eSewa payment URL
    window.location.href = paymentUrl;
  };

  const handleKhaltiPayment = () => {
    setLoading(true);

    const config = {
      publicKey: "test_public_key_4f0056c164884b55b26aaf7caf6511af",
      productIdentity: "your_product_identity",
      productName: "Your Product Name",
      productUrl: "http://localhost:3000",
      amount: subTotal * 1,
      eventHandler: {
        onSuccess(payload) {
          console.log(payload);
          setLoading(false);
          router.push("/success");
        },
        onError(error) {
          console.log(error);
          setLoading(false);
          router.push("/failed");
        },
        onClose() {
          setLoading(false);
        },
      },
    };

    const khaltiCheckout = new KhaltiCheckout(config);
    khaltiCheckout.show();
  };

  return (
    <div className="w-full md:py-20">
      <Wrapper>
        {cartItems.length > 0 && (
          <>
            <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
              <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
                Shopping Cart
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-12 py-10">
              <div className="flex-[2]">
                <div className="text-lg font-bold">Cart Items</div>
                {cartItems.map((item) => (
                  <CartItem key={item.id} data={item} />
                ))}
              </div>
              <div className="flex-[1]">
                <div className="text-lg font-bold">Summary</div>
                <div className="p-5 my-5 bg-black/[0.05] rounded-xl">
                  <div className="flex justify-between">
                    <div className="uppercase text-md md:text-lg font-medium text-black">
                      Subtotal
                    </div>
                    <div className="text-md md:text-lg font-medium text-black">
                      रू {subTotal}
                    </div>
                  </div>
                  <div className="text-sm md:text-md py-5 border-t mt-5">
                    The subtotal reflects the total price of your order,
                    including duties and taxes, before any applicable discounts.
                    It does not include delivery costs and international
                    transaction fees.
                  </div>
                </div>
               
                <button
                  className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center"
                  onClick={handleKhaltiPayment}
                >
                  Pay via Khalti
                  {loading && <img src="/spinner.svg" />}
                </button>
                <button
                  className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center"
                  onClick={handleESewaPayment}
                >
                  Pay via eSewa
                  {loading && <img src="/spinner.svg" />}
                </button>
              </div>
            </div>
          </>
        )}
        {cartItems.length < 1 && (
          <div className="flex-[2] flex flex-col items-center pb-[50px] md:-mt-14">
            <Image
              src="/empty-cart.jpg"
              width={300}
              height={300}
              className="w-[300px] md:w-[400px]"
            />
            <span className="text-xl font-bold">Your cart is empty</span>
            <span className="text-center mt-4">
              Looks like you have not added anything in your cart.
              <br />
              Go ahead and explore top categories.
            </span>
            <Link
              href="/"
              className="py-4 px-8 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 mt-8"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default Cart;
