"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Minus, Loader } from "lucide-react";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error("Error!", {
          description: res.message,
          className: "bg-red-600 text-white p-4 rounded-lg shadow-lg",
        });
        return;
      }

      // Handle success add to cart
      toast(res.message, {
        action: {
          label: "Go To Cart",
          onClick: () => router.push("/cart"),
        },
        className: "bg-primary text-white hover:bg-gray-800",
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast(res.message, {
        className: res.success
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white",
      });

      return;
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin"></Loader>
        ) : (
          <Minus className="h-4 w-4"></Minus>
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin"></Loader>
        ) : (
          <Plus className="h-4 w-4"></Plus>
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin"></Loader>
      ) : (
        <Plus className="h-4 w-4"></Plus>
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
