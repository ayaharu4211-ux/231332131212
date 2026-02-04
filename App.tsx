
import React, { useState, useEffect, useCallback } from 'react';
import { RakutenItem, LoadingStatus } from './types';
import { GENRES, RAKUTEN_API_BASE } from './constants';
import GenreSelector from './components/GenreSelector';
import ItemCard from './components/ItemCard';

const App: React.FC = () => {
  const [items, setItems] = useState<RakutenItem[]>([]);
  const [activeGenreId, setActiveGenreId] = useState<string>(GENRES[0].id);
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async (genreId: string) => {
    setStatus(LoadingStatus.LOADING);
    setError(null);

    const appId = process.env.RAKUTEN_APP_ID || '';
    const affiliateId = process.env.RAKUTEN_AFFILIATE_ID || '';

    if (!appId) {
        console.warn("Rakuten Application ID is missing. Using mock data for demonstration.");
        setTimeout(() => {
            const mockItems: RakutenItem[] = Array.from({ length: 30 }).map((_, i) => ({
                rank: i + 1,
                itemName: `【${i+1}位】${GENRES.find(g => g.id === genreId)?.name} カテゴリの注目アイテム サンプル商品名`,
                itemPrice: Math.floor(Math.random() * 10000) + 1000,
                itemUrl: "https://www.rakuten.co.jp",
                affiliateUrl: "https://a.r10.to/mock_url",
                mediumImageUrls: [{ imageUrl: `https://picsum.photos/seed/${genreId}${i}/300/300` }],
                shopName: "楽天公式ショップ"
            }));
            setItems(mockItems);
            setStatus(LoadingStatus.SUCCESS);
        }, 600);
        return;
    }

    try {
      const url = new URL(RAKUTEN_API_BASE);
      url.searchParams.append('format', 'json');
      url.searchParams.append('applicationId', appId);
      url.searchParams.append('affiliateId', affiliateId);
      url.searchParams.append('period', 'realtime');
      url.searchParams.append('hits', '30');
      if (genreId !== '0') {
        url.searchParams.append('genreId', genreId);
      }

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const mappedItems = data.Items.map((item: any) => ({
        rank: item.Item.rank,
        itemName: item.Item.itemName,
        itemPrice: item.Item.itemPrice,
        itemUrl: item.Item.itemUrl,
        affiliateUrl: item.Item.affiliateUrl,
        mediumImageUrls: item.Item.mediumImageUrls,
        shopName: item.Item.shopName,
      }));

      setItems(mappedItems);
      setStatus(LoadingStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ランキングの取得に失敗しました');
      setStatus(LoadingStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchRanking(activeGenreId);
    // Scroll to top when genre changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeGenreId, fetchRanking]);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-red-600 text-white h-[60px] flex flex-col items-center justify-center sticky top-0 z-20 shadow-md">
        <h1 className="text-lg font-bold tracking-tight flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45z"/></svg>
            Rakuten Ranking Copier
        </h1>
        <p className="text-[9px] opacity-80 uppercase tracking-widest">Real-time Top 30</p>
      </header>

      {/* Genre Filter */}
      <GenreSelector activeGenreId={activeGenreId} onSelect={setActiveGenreId} />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {status === LoadingStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium animate-pulse text-sm">最新ランキングを取得中...</p>
          </div>
        )}

        {status === LoadingStatus.ERROR && (
          <div className="bg-red-50 text-red-700 p-8 rounded-2xl border border-red-100 text-center my-10 shadow-sm">
            <p className="font-bold mb-2">通信エラー</p>
            <p className="text-xs mb-6 opacity-80">{error}</p>
            <button
              onClick={() => fetchRanking(activeGenreId)}
              className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
            >
              再読み込み
            </button>
          </div>
        )}

        {status === LoadingStatus.SUCCESS && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {items.map((item) => (
              <ItemCard key={`${item.rank}-${item.itemName}`} item={item} />
            ))}
          </div>
        )}
        
        {status === LoadingStatus.SUCCESS && items.length === 0 && (
          <div className="text-center py-32 text-gray-400 italic">
            ランキングデータが見つかりませんでした。
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-12 border-t border-gray-200 pt-8 text-center text-[10px] text-gray-400 pb-20">
        <p className="font-medium">© 2024 Rakuten Ranking Copier</p>
        <p className="mt-1">Supported by Rakuten Developers API</p>
      </footer>
    </div>
  );
};

export default App;
