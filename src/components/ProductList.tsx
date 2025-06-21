'use client'
import { Product } from '@/payload-types'
import { Fragment } from "react";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[]
  searchParams?: any;
}

const ProductList = ({
  products,
  searchParams,
}: Props) => {
  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");


    // if (sortType === "asc") {
    //   productQuery.ascending(sortBy);
    // }
    // if (sortType === "desc") {
    //   productQuery.descending(sortBy);
    // }
  }

  // const res = await productQuery.find();
  return (
    <div className="mt-4 flex gap-x-[1.5%] min-[1359px]:gap-x-[2%] min-[1400px]:gap-x-[3%] min-[1570px]:gap-x-[4%] gap-y-8 justify-center flex-wrap">
      {products.map((product:Product, index) => (
        <Fragment key={`product_${index}`}>
          <ProductCard product={product} />
      </Fragment>
      ))}
      {/*{searchParams?.cat || searchParams?.name ? (*/}
      {/*  <Pagination*/}
      {/*    currentPage={2 || 0}*/}
      {/*    hasPrev={true}*/}
      {/*    hasNext={true}*/}
      {/*  />*/}
      {/*) : null}*/}
    </div>
  );
};

export default ProductList;
