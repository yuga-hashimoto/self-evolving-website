import fs from 'fs';
import { execSync } from 'child_process';

// Script to add commit URLs to existing changelog entries

const REPO_URL = 'https://github.com/y-c-hashimoto/self-evolving-website';

const models = ['ai2', 'ai1'];

for (const modelId of models) {
    const changelogPath = `public/models/${modelId}/changelog-jp.json`;

    if (!fs.existsSync(changelogPath)) {
        console.log(`⚠️  ${changelogPath} does not exist, skipping...`);
        continue;
    }

    const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
    let updated = false;

    for (const entry of changelog) {
        // Skip if prUrl already exists
        if (entry.prUrl) {
            console.log(`✓ Entry ${entry.id} already has prUrl, skipping...`);
            continue;
        }

        // Skip if commitUrl already exists
        if (entry.commitUrl) {
            console.log(`✓ Entry ${entry.id} already has commitUrl, skipping...`);
            continue;
        }

        // Search for commit by date
        const date = entry.date;
        console.log(`\n🔍 Searching commit for entry ${entry.id} (${date})...`);

        try {
            // Get commits for that date
            const commits = execSync(
                `gh api repos/:owner/:repo/commits --jq '.[] | select(.commit.author.date == "${date}") | "\\(.sha) \\(.html_url)"'`,
                { encoding: 'utf-8' }
            ).trim();

            if (commits) {
                const [sha, url] = commits.split(' ');
                entry.commitUrl = url;
                entry.commitSha = sha.substring(0, 7);
                console.log(`✅ Found commit: ${sha.substring(0, 7)}`);
                console.log(`   URL: ${url}`);
                updated = true;
            } else {
                // If exact date not found, search within 1 minute range
                console.log('   Exact match not found, searching nearby commits...');

                const dateObj = new Date(date);
                const before = new Date(dateObj.getTime() + 60000).toISOString();
                const after = new Date(dateObj.getTime() - 60000).toISOString();

                // Search by file
                if (entry.files && entry.files.length > 0) {
                    const firstFile = entry.files[0];
                    console.log(`   Searching by file: ${firstFile}`);

                    try {
                        const fileCommits = execSync(
                            `gh api repos/:owner/:repo/commits?path=${firstFile}&since=${after}&until=${before} --jq '.[0] | "\\(.sha) \\(.html_url)"'`,
                            { encoding: 'utf-8' }
                        ).trim();

                        if (fileCommits) {
                            const [sha, url] = fileCommits.split(' ');
                            entry.commitUrl = url;
                            entry.commitSha = sha.substring(0, 7);
                            console.log(`✅ Found commit by file: ${sha.substring(0, 7)}`);
                            console.log(`   URL: ${url}`);
                            updated = true;
                        }
                    } catch (e) {
                        console.log(`   ⚠️  Could not find commit by file: ${e.message}`);
                    }
                }

                if (!entry.commitUrl) {
                    console.log(`   ⚠️  Could not find matching commit`);
                }
            }
        } catch (error) {
            console.error(`   ❌ Error searching commit: ${error.message}`);
        }
    }

    if (updated) {
        fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));
        console.log(`\n✅ Updated ${changelogPath}`);
    } else {
        console.log(`\n⚠️  No updates needed for ${changelogPath}`);
    }
}

console.log('\n✅ Done!');
