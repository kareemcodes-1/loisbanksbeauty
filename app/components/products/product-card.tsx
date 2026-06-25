import Image from 'next/image';
import { priceFormatter } from '@/lib/priceFormatter';
import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ item }: { item: any }) => {
  return (
    <a
      href={`/products/p/${item?.name.replace(/\s+/g, '-')}`}
      className="group flex flex-col"
    >
      <div className="bg-[#f6f6f4] rounded-[16px] h-[20rem] lg:h-[25rem] overflow-hidden relative">
        <Image
          src={item.images[0]}
          alt={item.name}
          fill
          className="object-cover rounded-[16px] transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="mt-4 flex items-start justify-between gap-6">

        {/* Left Side */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.4rem] text-black geist-font !font-medium leading-[1.2]">
            {item.name}
          </h2>

          <p className="text-[1.4rem] text-black/90 uppercase font-bold">
            {priceFormatter(item.price)}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end gap-3">

          <button className="bg-[#FD3F92] text-white uppercase px-[1.5rem] py-[0.9rem] rounded-full text-sm font-medium tracking-wide hover:bg-[#E63281] transition-colors duration-300 cursor-pointer">
            <ShoppingCart strokeWidth={2} size={25} />
          </button>
        </div>

      </div>
    </a>
  );
};

export default ProductCard;