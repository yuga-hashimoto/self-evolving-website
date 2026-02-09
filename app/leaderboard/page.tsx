export default function Leaderboard() {
  const users = [
    { rank: 1, name: "CodeMaster99", points: 1540 },
    { rank: 2, name: "PixelArtist", points: 1200 },
    { rank: 3, name: "JulesAgent", points: 980 },
    { rank: 4, name: "WebWizard", points: 850 },
    { rank: 5, name: "AI_Explorer", points: 720 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Top Contributors</h1>
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 text-gray-400">Rank</th>
              <th className="py-2 px-4 text-gray-400">User</th>
              <th className="py-2 px-4 text-gray-400">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.rank} className="border-b border-gray-700 hover:bg-gray-700 transition">
                <td className="py-3 px-4 text-yellow-400 font-bold">#{user.rank}</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4 text-green-400 font-mono">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-8">
        <a href="/" className="text-blue-400 hover:underline">← Back to Home</a>
      </div>
    </div>
  );
}
