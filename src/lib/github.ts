interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}

export interface Evolution {
  id: string;
  version: string;
  title: string;
  desc: string;
  timestamp: string;
  url: string;
}

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'yuga-hashimoto';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'self-evolving-website';

export async function getLatestCommits(limit: number = 3): Promise<Evolution[]> {
  try {
    const headers: HeadersInit = {
      'User-Agent': 'Self-Evolving-Website',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${limit}`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers
    });

    if (!res.ok) {
        console.error('Failed to fetch commits:', res.statusText);
        return [];
    }

    const commits: Commit[] = await res.json();

    return commits.map(commit => {
      const messageParts = commit.commit.message.split('\n\n');
      const title = messageParts[0];
      const desc = messageParts.length > 1 ? messageParts[1] : '';

      return {
        id: commit.sha,
        version: commit.sha.substring(0, 7),
        title: title,
        desc: desc,
        timestamp: commit.commit.author.date,
        url: commit.html_url
      };
    });
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}
