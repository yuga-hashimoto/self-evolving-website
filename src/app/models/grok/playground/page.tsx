import Game2048 from './components/Game2048';

export default function GrokPlayground() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      {/* ヘッダー + 広告エリア */}
      <header className="p-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          ゲームコレクション
        </h1>
        <p className="text-gray-300">
          AIが作る中毒性ゲーム
        </p>
        {/* 広告エリア（AdSense用） */}
        <div className="mt-4 flex justify-center">
          <div className="bg-white/5 border border-white/10 rounded p-4 text-gray-500 text-sm">
            広告エリア（728x90 or 320x50）
          </div>
        </div>
      </header>

      {/* ゲームエリア */}
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Game2048 />
      </main>

      {/* フッター - 統計 + 広告エリア */}
      <footer className="p-4 bg-black/20">
        {/* 広告エリア（AdSense用） */}
        <div className="mb-4 flex justify-center">
          <div className="bg-white/5 border border-white/10 rounded p-4 text-gray-500 text-sm">
            広告エリア（728x90 or 320x50）
          </div>
        </div>

        {/* 統計 */}
        <div className="container mx-auto flex justify-around text-center">
          <div>
            <p className="text-gray-400 text-sm">プレイ回数</p>
            <p className="text-white text-2xl font-bold">-</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">ハイスコア</p>
            <p className="text-white text-2xl font-bold">-</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">累計時間</p>
            <p className="text-white text-2xl font-bold">-</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
