import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import { getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
        limit={4}
      ></ProductList>
      <ViewAllProductsButton></ViewAllProductsButton>
    </>
  );
};

export default Homepage;
