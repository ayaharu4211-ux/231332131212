
import React, { useState } from 'react';
import { RakutenItem } from '../types';

interface ItemCardProps {
  item: RakutenItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.affiliateUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 transition-transform hover:scale-[1.02]">
      <div className="relative pt-[100%] bg-gray-50">
        <img
          src={item.mediumImageUrls[0]?.imageUrl || 'https://picsum.photos/200/200'}
          alt={item.itemName}
          className="absolute top-0 left-0 w-full h-full object-contain p-2"
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
          {item.rank}位
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-sm font-bold line-clamp-2 text-gray-800 mb-1 h-10 leading-snug">
            {item.itemName}
          </h3>
          <p className="text-xs text-gray-500 truncate mb-2">{item.shopName}</p>
          <p className="text-lg font-bold text-red-600 mb-3">
            ¥{item.itemPrice.toLocaleString()}
          </p>
        </div>
        
        <div className="mt-auto space-y-2">
          <button
            onClick={handleCopy}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                コピー完了
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                ROOM投稿URLコピー
              </>
            )}
          </button>
          
          <a
            href={item.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 border border-gray-200 rounded-lg text-center text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            商品ページを見る
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
