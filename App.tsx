

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

    // アプリケーションIDとアフィリエイトID
    const appId = process.env.RAKUTEN_APP_ID || '1069849120479290339';
    const affiliateId = process.env.RAKUTEN_AFFILIATE_ID || '1cd2c935.7bc813b2.1cd2c936.7c0882f2';

    try {
      const url = new URL(RAKUTEN_API_BASE);
      url.searchParams.append('format', 'json');
      url.searchParams.append('applicationId', appId);
      url.searchParams.append('affiliateId', affiliateId);
      url.searchParams.append('period', 'realtime');
      url.searchParams.append('hits', '30');
      
      if (genreId && genreId !== '0') {
        url.searchParams.append('genreId', genreId);
      }

      console.log('Fetching from URL:', url.toString());

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errText = await response.text();
        let errorMessage = `エラー: ${response.status}`;
        try {
            const errData = JSON.parse(errText);
            errorMessage = errData.error_description || errData.error || errorMessage;
        } catch(e) {
            errorMessage = errText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();

      if (!data.Items || !Array.isArray(data.Items)) {
        setItems([]);
        setStatus(LoadingStatus.SUCCESS);
        return;
      }

      // 取得したデータをマッピング
      const mappedItems = data.Items.map((itemData: any) => {
        // APIレスポンスは { Item: { ... } } という構造です
        const item = itemData.Item;
        return {
          rank: item.rank,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemUrl: item.itemUrl,
          // affiliateUrlが空の場合はitemUrlを代用（トラッキング用）
          affiliateUrl: item.affiliateUrl || item.itemUrl,
          mediumImageUrls: item.mediumImageUrls || [],
          shopName: item.shopName,
        };
      });

      setItems(mappedItems);
      setStatus(LoadingStatus.SUCCESS);
    } catch (err: any) {
      console.error('Fetch error detail:', err);
      setError(err.message || 'ランキングの取得に失敗しました。');
      setStatus(LoadingStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    fetchRanking(activeGenreId);
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
        <p className="text-[9px] opacity-80 uppercase tracking-widest font-medium">リアルタイム総合・ジャンル別 TOP 30</p>
      </header>

      {/* ジャンル切り替え */}
      <GenreSelector activeGenreId={activeGenreId} onSelect={setActiveGenreId} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {status === LoadingStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium animate-pulse text-sm">最新ランキングを読込中...</p>
          </div>
        )}

        {status === LoadingStatus.ERROR && (
          <div className="bg-white p-8 rounded-2xl border border-red-100 text-center my-10 shadow-sm max-w-sm mx-auto">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <p className="font-bold text-gray-800 mb-1">データを取得できません</p>
            <p className="text-xs text-red-500 mb-4 font-mono break-all">{error}</p>
            <p className="text-[10px] text-gray-500 mb-6 px-4 leading-relaxed">
              URL設定に誤りがあるか、APIの制限により取得できていません。
            </p>
            <button
              onClick={() => fetchRanking(activeGenreId)}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              再読み込み
            </button>
          </div>
        )}

        {status === LoadingStatus.SUCCESS && items.length > 0 && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {items.map((item, idx) => (
              <ItemCard key={`${item.rank}-${idx}`} item={item} />
            ))}
          </div>
        )}
        
        {status === LoadingStatus.SUCCESS && items.length === 0 && (
          <div className="text-center py-32 text-gray-400 italic">
            ランキングデータが空です。ジャンルを変えてみてください。
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-12 border-t border-gray-200 pt-10 text-center pb-20">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rakuten Ranking Copier</p>
        <p className="mt-2 text-[10px] text-gray-300">Supported by Rakuten Developers API</p>
      </footer>
    </div>
  );
};

export default App;
