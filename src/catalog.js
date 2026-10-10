// Fixed eight-title allowlist. Current main, deployment and capture are distinct.
// Full read-only evidence: docs/evidence/current-games.json and images-current.json.
import {validateRankingConnection} from './ranking/reader.js';
export const OFFICIAL_PLAY_URLS = Object.freeze({
  kaisen:'https://chameleonjp-lab.github.io/kaisen/',
  faitofuraito:'https://chameleonjp-lab.github.io/faitofuraito/',
  machimamore:'https://chameleonjp-lab.github.io/machimamore/',
  gekichin:'https://chameleonjp-lab.github.io/gekichin/',
  uchiotose:'https://chameleonjp-lab.github.io/uchiotose/',
  senryou:'https://chameleonjp-lab.github.io/senryou/',
  fantasia:'https://chameleonjp-lab.github.io/fantasia/',
});

export const catalog = [
  {
    "id": "kaisen",
    "displayOrder": 1,
    "title": "カイセン",
    "description": "自機と4機の僚機で、敵航空機と戦艦を撃破する海上空戦のタイムアタック。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/kaisen/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/kaisen",
    "sourceCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
    "sourceRoot": "https://github.com/chameleonjp-lab/kaisen/tree/519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/kaisen/blob/519fd0d50dfb2ce9a1145c0b58a1301b5c74d032/README.md",
      "https://github.com/chameleonjp-lab/kaisen/blob/519fd0d50dfb2ce9a1145c0b58a1301b5c74d032/src/main.ts"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/kaisen/",
      "candidateUrl": null,
      "deployedCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
      "sourceIsLatestMain": true,
      "checkedAt": "2026-10-09T14:49:02.613131+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned deployed-source production build compared byte for byte to the current public product assets",
        "Current deployed bytes were replayed offline in a fresh Chromium context; the actual Home/title pixels were captured and reviewed without any start or input operation"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/kaisen/deployment.json",
        "https://github.com/chameleonjp-lab/kaisen/actions/runs/37300960802",
        "https://github.com/chameleonjp-lab/kaisen/tree/519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
        "docs/evidence/images-current.json"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "This observation does not prove all game features or release acceptance completed",
        "The Home observation is offline replay of exact deployed bytes; no direct live browser or combat-screen acceptance is claimed"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "assets/index-AnoDvxMm.js": "bc0e3bf86a54b5e673e7a7b0e5eafbb85bf6ad2f059eaab41c72d4d9430b8f3d",
        "assets/index-CC4z0vjG.css": "27a94f1a79f29ec460e9d2493989b05d0870874621a13186c397a5fe3e0c527a",
        "index.html": "864fac28e535f8022fd4edc4c14035b83e906460a60f9bb190e30da6f3ac0cff",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "da7f34d4f3a8f762c580b87d9458e6959e6c05cd56abf36b432912a1e982fa95",
      "allProductHashesMatch": true,
      "productFileCount": 4,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 37300960802,
        "runUrl": "https://github.com/chameleonjp-lab/kaisen/actions/runs/37300960802",
        "headCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
        "headBranch": "main",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-05T11:07:58Z",
        "updatedAt": "2026-10-05T11:09:19Z",
        "deployJobId": 111733672361,
        "completedRecordAt": "2026-10-05T11:09:18Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/kaisen/",
        "finalUrl": "https://chameleonjp-lab.github.io/kaisen/",
        "status": 200,
        "sha256": "864fac28e535f8022fd4edc4c14035b83e906460a60f9bb190e30da6f3ac0cff",
        "bytes": 11598,
        "observedAt": "2026-10-09T15:02:33.298254+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "homeCheck": {
        "sourceCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
        "deployedCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
        "checkedAt": "2026-10-09T14:53:14.033Z",
        "appliesToCurrentDeployedSource": true,
        "appliesToLatestMain": true,
        "method": "deployed_byte_replay",
        "evidenceFile": "docs/evidence/images-current.json",
        "browser": "Chromium 153.0.8010.12",
        "playwright": "1.63.0",
        "viewport": {
          "width": 1280,
          "height": 720
        },
        "deviceScaleFactor": 1,
        "homeVisible": true,
        "playingVisible": false,
        "homeRendererVisible": true,
        "gameStarted": false,
        "inputPerformed": false,
        "pageErrorCount": 0,
        "consoleErrorCount": 0,
        "network": {
          "browserOffline": true,
          "replayedOnlyTlsVerifiedHashMatchedProductFiles": true,
          "nonGetRequestsAttempted": 0,
          "externalRequestsFulfilled": 0,
          "blockedRequests": 0,
          "staticRequestsServed": 3,
          "note": "Fresh browser context. Requests were fulfilled only from exact URL/path entries whose bytes matched the TLS-verified observation hashes; all unknown URLs and methods other than GET/HEAD were set to abort. No external request was fulfilled or blocked because none was attempted."
        },
        "gameplayScreenshotAccepted": false,
        "originalScreenshotSha256": "42a69bc9873d2dc3cd40b006e4092d7707bc52c341f3ceef2228f0283ff67d5f"
      }
    },
    "thumbnail": {
      "kind": "title_screen",
      "version": "42a69bc9873d2dc3cd40b006e4092d7707bc52c341f3ceef2228f0283ff67d5f",
      "variants": [
        {
          "src": "assets/screenshots/kaisen-42a69bc9873d-640.webp",
          "width": 640,
          "height": 360,
          "sha256": "150b9fe5f7972af2cd1b7cf5cc19d1c9b4f10a0ce3d75f07d9e1663f9b31ccb9",
          "bytes": 7604,
          "format": "image/webp"
        },
        {
          "src": "assets/screenshots/kaisen-42a69bc9873d-960.webp",
          "width": 960,
          "height": 540,
          "sha256": "744f6cc035f094cc1f11b5f8437ae9606adb5d35308560f09e0bb04e5a7d97f8",
          "bytes": 13250,
          "format": "image/webp"
        }
      ],
      "alt": "カイセンの公開版タイトル画面。海上に戦闘機と艦隊が表示され、左側に操作モード選択と出撃ボタンがある。",
      "caption": "公開版のタイトル画面（戦闘画面ではありません）。",
      "evidence": {
        "sourceUrl": "https://chameleonjp-lab.github.io/kaisen/",
        "sourceCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
        "deployedCommit": "519fd0d50dfb2ce9a1145c0b58a1301b5c74d032",
        "capturedAt": "2026-10-09T14:53:14.033Z",
        "rights": "このタスクでユーザーが公開製品画面の撮影とポータル掲載用派生を明示承認。製品リポジトリ全体のライセンスとは主張しない。公開版NOTICEはThree.jsのMIT表示のみ。製品資料に記された画面素材の来歴はrightsBasisを参照。",
        "evidenceFile": "docs/evidence/images-current.json",
        "originalSha256": "42a69bc9873d2dc3cd40b006e4092d7707bc52c341f3ceef2228f0283ff67d5f",
        "derivatives": [
          {
            "src": "assets/screenshots/kaisen-42a69bc9873d-640.webp",
            "sha256": "150b9fe5f7972af2cd1b7cf5cc19d1c9b4f10a0ce3d75f07d9e1663f9b31ccb9"
          },
          {
            "src": "assets/screenshots/kaisen-42a69bc9873d-960.webp",
            "sha256": "744f6cc035f094cc1f11b5f8437ae9606adb5d35308560f09e0bb04e5a7d97f8"
          }
        ],
        "rightsBasis": [
          {
            "path": "docs/PROVENANCE.md",
            "url": "https://github.com/chameleonjp-lab/kaisen/blob/519fd0d50dfb2ce9a1145c0b58a1301b5c74d032/docs/PROVENANCE.md"
          }
        ]
      }
    },
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-09T14:58:37.293190+00:00"
  },
  {
    "id": "faitofuraito",
    "displayOrder": 2,
    "title": "ファイトフライト",
    "description": "零戦二一型を題材に、操縦と射撃を楽しむ空戦ゲーム。時間無制限のノーマルと、5分間のイージーを選べます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/faitofuraito",
    "sourceCommit": "8946bf12a777d24c7334b887492d62fd93153e23",
    "sourceRoot": "https://github.com/chameleonjp-lab/faitofuraito/tree/8946bf12a777d24c7334b887492d62fd93153e23",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/faitofuraito/blob/8946bf12a777d24c7334b887492d62fd93153e23/README.md",
      "https://github.com/chameleonjp-lab/faitofuraito/blob/8946bf12a777d24c7334b887492d62fd93153e23/public/ranking-manifest.json"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
      "candidateUrl": null,
      "deployedCommit": "8946bf12a777d24c7334b887492d62fd93153e23",
      "sourceIsLatestMain": true,
      "checkedAt": "2026-10-09T14:49:03.307608+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned deployed-source production build compared byte for byte to the current public product assets",
        "All observed public files, including the manifest, match the exact gh-pages branch tree",
        "Current deployed bytes were replayed offline in a fresh Chromium context; the actual Home/title pixels were captured and reviewed without any start or input operation"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/faitofuraito/deployment.json",
        "https://github.com/chameleonjp-lab/faitofuraito/actions/runs/37456726210",
        "https://github.com/chameleonjp-lab/faitofuraito/tree/8946bf12a777d24c7334b887492d62fd93153e23",
        "docs/evidence/images-current.json"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "This observation does not prove all game features or release acceptance completed",
        "The Home observation is offline replay of exact deployed bytes; no direct live browser or combat-screen acceptance is claimed"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "assets/index-BAlrsVZ7.js": "a3388c5c28ff1436356e9221a4ace164a297d545fa3e81235ba45d56d5e5ebbe",
        "assets/index-DWkc_rYZ.css": "279163e59993581a7adf69a62c5a97539a04d84186b03bc6ffe57ac0d0b7c7ca",
        "index.html": "6aea1740f48d2661acf84a277e1ed96cb4f55b3e6a560dc8166f908a6868df3b",
        "ranking-manifest.json": "5f3a91f821ea3894ece70d6ee4f2978467df1b3d04692e1a4c943c953085de17",
        "social-card.png": "7a3fb68e0504a3a2ec31178325394cf62a793518f65833645e69661353db8989",
        "third-party-notices.txt": "8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc"
      },
      "manifestSha256": "0518640ebdfab12966fba39fb6725e66aec571d6ceaa69b43c5d96627a913660",
      "allProductHashesMatch": true,
      "productFileCount": 6,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_pages_branch",
        "runId": 37456726210,
        "runUrl": "https://github.com/chameleonjp-lab/faitofuraito/actions/runs/37456726210",
        "headCommit": "88bfaf5ac6d75aee70c9eaaab569a3a404e07b4d",
        "headBranch": "gh-pages",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-06T11:29:19Z",
        "updatedAt": "2026-10-06T11:31:08Z",
        "deployJobId": 112246126135,
        "completedRecordAt": "2026-10-06T11:31:07Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "deployedBranchCommit": "88bfaf5ac6d75aee70c9eaaab569a3a404e07b4d",
      "deployedBranchBytesMatch": true,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/faitofuraito/",
        "finalUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
        "status": 200,
        "sha256": "6aea1740f48d2661acf84a277e1ed96cb4f55b3e6a560dc8166f908a6868df3b",
        "bytes": 18190,
        "observedAt": "2026-10-09T15:02:33.298937+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "homeCheck": {
        "sourceCommit": "8946bf12a777d24c7334b887492d62fd93153e23",
        "deployedCommit": "8946bf12a777d24c7334b887492d62fd93153e23",
        "checkedAt": "2026-10-09T14:53:50.784Z",
        "appliesToCurrentDeployedSource": true,
        "appliesToLatestMain": true,
        "method": "deployed_byte_replay",
        "evidenceFile": "docs/evidence/images-current.json",
        "browser": "Chromium 153.0.8010.12",
        "playwright": "1.63.0",
        "viewport": {
          "width": 1280,
          "height": 720
        },
        "deviceScaleFactor": 1,
        "homeVisible": true,
        "playingVisible": false,
        "homeRendererVisible": true,
        "gameStarted": false,
        "inputPerformed": false,
        "pageErrorCount": 0,
        "consoleErrorCount": 0,
        "network": {
          "browserOffline": true,
          "replayedOnlyTlsVerifiedHashMatchedProductFiles": true,
          "nonGetRequestsAttempted": 0,
          "externalRequestsFulfilled": 0,
          "blockedRequests": 0,
          "staticRequestsServed": 3,
          "note": "Fresh browser context. Requests were fulfilled only from exact URL/path entries whose bytes matched the TLS-verified observation hashes; all unknown URLs and methods other than GET/HEAD were set to abort. No external request was fulfilled or blocked because none was attempted."
        },
        "gameplayScreenshotAccepted": false,
        "originalScreenshotSha256": "ce4eff271a448d608c924c9733f23a9d081591aa24ba0f482c4b3bba403876a4"
      }
    },
    "thumbnail": {
      "kind": "title_screen",
      "version": "ce4eff271a448d608c924c9733f23a9d081591aa24ba0f482c4b3bba403876a4",
      "variants": [
        {
          "src": "assets/screenshots/faitofuraito-ce4eff271a44-640.webp",
          "width": 640,
          "height": 360,
          "sha256": "c5c1c2df67305270b1369c3eb4417187ba0d991cdc5c2ddd00dea2dac3e6b183",
          "bytes": 9648,
          "format": "image/webp"
        },
        {
          "src": "assets/screenshots/faitofuraito-ce4eff271a44-960.webp",
          "width": 960,
          "height": 540,
          "sha256": "85ba341db20b1d6cb3f8da08b4e25009422e6f80f04617d944bf4db6cbb9300e",
          "bytes": 17812,
          "format": "image/webp"
        }
      ],
      "alt": "ファイトフライトの公開版タイトル画面。青空と零戦の背景にゲーム名が表示され、中央パネルにモード選択と空のパイロット名欄がある。",
      "caption": "公開版のタイトル画面（戦闘画面ではありません）。",
      "evidence": {
        "sourceUrl": "https://chameleonjp-lab.github.io/faitofuraito/",
        "sourceCommit": "8946bf12a777d24c7334b887492d62fd93153e23",
        "deployedCommit": "8946bf12a777d24c7334b887492d62fd93153e23",
        "deployedBranchCommit": "88bfaf5ac6d75aee70c9eaaab569a3a404e07b4d",
        "capturedAt": "2026-10-09T14:53:50.784Z",
        "rights": "このタスクでユーザーが公開製品画面の撮影とポータル掲載用派生を明示承認。製品リポジトリ全体のライセンスとは主張しない。公開版NOTICEはThree.jsのMIT表示のみ。製品資料に記された画面素材の来歴はrightsBasisを参照。",
        "evidenceFile": "docs/evidence/images-current.json",
        "originalSha256": "ce4eff271a448d608c924c9733f23a9d081591aa24ba0f482c4b3bba403876a4",
        "derivatives": [
          {
            "src": "assets/screenshots/faitofuraito-ce4eff271a44-640.webp",
            "sha256": "c5c1c2df67305270b1369c3eb4417187ba0d991cdc5c2ddd00dea2dac3e6b183"
          },
          {
            "src": "assets/screenshots/faitofuraito-ce4eff271a44-960.webp",
            "sha256": "85ba341db20b1d6cb3f8da08b4e25009422e6f80f04617d944bf4db6cbb9300e"
          }
        ],
        "rightsBasis": [
          {
            "path": "README.md",
            "url": "https://github.com/chameleonjp-lab/faitofuraito/blob/8946bf12a777d24c7334b887492d62fd93153e23/README.md"
          }
        ]
      }
    },
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": "normal",
      "modes": [
        {
          "id": "normal",
          "label": "ノーマル",
          "gameSlug": "faitofuraito_normal",
          "rulesVersion": null,
          "contractVersion": null,
          "score": {
            "unit": "点",
            "scale": 1,
            "decimals": 0,
            "order": "desc"
          },
          "verification": null
        },
        {
          "id": "easy",
          "label": "イージー",
          "gameSlug": "faitofuraito_easy",
          "rulesVersion": null,
          "contractVersion": null,
          "score": {
            "unit": "点",
            "scale": 1,
            "decimals": 0,
            "order": "desc"
          },
          "verification": null
        }
      ]
    },
    "contentUpdatedAt": "2026-10-09T14:58:37.293190+00:00"
  },
  {
    "id": "machimamore",
    "displayOrder": 3,
    "title": "マチマモレ",
    "description": "街20区画を守り、味方戦闘機と50機の敵UFOを迎撃する都市防衛ゲーム。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/machimamore/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/machimamore",
    "sourceCommit": "cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70",
    "sourceRoot": "https://github.com/chameleonjp-lab/machimamore/tree/cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70",
    "sourceObservedAt": "2026-10-10T03:17:40.327453+00:00",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/machimamore/blob/cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70/README.md",
      "https://github.com/chameleonjp-lab/machimamore/blob/cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70/src/main.ts",
      "https://github.com/chameleonjp-lab/machimamore/blob/cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70/README.md"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/machimamore/",
      "candidateUrl": null,
      "deployedCommit": "cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70",
      "sourceIsLatestMain": true,
      "checkedAt": "2026-10-10T03:17:40.327453+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, deployment manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned current-main production build compared byte for byte to the current public product assets"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/machimamore/deployment.json",
        "https://github.com/chameleonjp-lab/machimamore/actions/runs/38019861713",
        "https://github.com/chameleonjp-lab/machimamore/tree/cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "Current product source and published bytes are verified; full gameplay/release acceptance is not claimed",
        "No title screenshot is claimed for this new deployed source; historical images are not retagged"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "artifact-manifest.json": "648231e89c25af736346da4822afbc16ebc7e718c8382c4d3e208bd0396413ee",
        "assets/index-HVHVUVZ-.css": "9be6cdcdbbbe9a9774071aee82eb7052022eec3af68b6385e949ce77d28ba824",
        "assets/index-oETSqCgi.js": "071fd026445754c1fee42701dbef2be15d23b4acbe7f05972173bb482aaa0570",
        "index.html": "b4ca6aa64aed0c1e5edf71f51ecf092cf0403de88852108a9b8cd18f9a94275b",
        "third-party-notices.txt": "8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc"
      },
      "manifestSha256": "dc9853c72a3d76f5eea9c16f4a983b6e9aef0eb093ed0d500e91a21113d6eaf5",
      "manifestFile": "deployment.json",
      "allProductHashesMatch": true,
      "productFileCount": 5,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 38019861713,
        "runUrl": "https://github.com/chameleonjp-lab/machimamore/actions/runs/38019861713",
        "headCommit": "cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70",
        "headBranch": "main",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-10T03:14:29Z",
        "updatedAt": "2026-10-10T03:16:35Z",
        "deployJobId": 114118588781,
        "completedRecordAt": "2026-10-10T03:16:34Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/machimamore/",
        "finalUrl": "https://chameleonjp-lab.github.io/machimamore/",
        "status": 200,
        "sha256": "b4ca6aa64aed0c1e5edf71f51ecf092cf0403de88852108a9b8cd18f9a94275b",
        "bytes": 9302,
        "observedAt": "2026-10-10T03:17:40.327453+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "deploymentManifest": {
        "schema": 1,
        "repository": "chameleonjp-lab/machimamore",
        "commit": "cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70",
        "sourceContentDigest": "37ef1ac1631b2fd306896fb81bd5cd6b4387b752927a646569996e71b8e78fe5",
        "sourceManifestSha256": "671aa8565a0dc5f473b2c28e8a9f3d09164b4e60e9269218736f815160606d24",
        "files": [
          {
            "path": "artifact-manifest.json",
            "bytes": 660,
            "sha256": "648231e89c25af736346da4822afbc16ebc7e718c8382c4d3e208bd0396413ee"
          },
          {
            "path": "assets/index-HVHVUVZ-.css",
            "bytes": 34702,
            "sha256": "9be6cdcdbbbe9a9774071aee82eb7052022eec3af68b6385e949ce77d28ba824"
          },
          {
            "path": "assets/index-oETSqCgi.js",
            "bytes": 729658,
            "sha256": "071fd026445754c1fee42701dbef2be15d23b4acbe7f05972173bb482aaa0570"
          },
          {
            "path": "index.html",
            "bytes": 9302,
            "sha256": "b4ca6aa64aed0c1e5edf71f51ecf092cf0403de88852108a9b8cd18f9a94275b"
          },
          {
            "path": "third-party-notices.txt",
            "bytes": 1081,
            "sha256": "8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc"
          }
        ],
        "sourceTree": "d738268cee36630a50256fb0933e8dbc9f97a5e0",
        "workflowCommit": "cb7d698a50abb8bbb53b00c2e0071fc7cfc28b70",
        "publicationAuthorizationDate": "2026-10-10",
        "publicationScope": "User-requested verification build; final physical-phone and gameplay acceptance are not claimed"
      },
      "sourceContentDigest": "37ef1ac1631b2fd306896fb81bd5cd6b4387b752927a646569996e71b8e78fe5",
      "sourceManifestSha256": "671aa8565a0dc5f473b2c28e8a9f3d09164b4e60e9269218736f815160606d24",
      "deploymentManifestMatchesIndependentBuild": null,
      "manifestVariance": "The source-manifest generation timestamp was not reconstructed; public product files and the source content digest match independently",
      "sourceValidation": {
        "sourceInputFileCount": 95,
        "matchesPublicDeploymentDigest": true
      }
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-10T03:33:43.645878+00:00"
  },
  {
    "id": "gekichin",
    "displayOrder": 4,
    "title": "ゲキチン",
    "description": "超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/gekichin/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/gekichin",
    "sourceCommit": "cd9431c53d64543c0d49e562dea9ea03d22a609c",
    "sourceRoot": "https://github.com/chameleonjp-lab/gekichin/tree/cd9431c53d64543c0d49e562dea9ea03d22a609c",
    "sourceObservedAt": "2026-10-10T03:19:35.105627+00:00",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/gekichin/blob/cd9431c53d64543c0d49e562dea9ea03d22a609c/src/main.ts",
      "https://github.com/chameleonjp-lab/gekichin/blob/cd9431c53d64543c0d49e562dea9ea03d22a609c/docs/IMPLEMENTATION_STATUS.md",
      "https://github.com/chameleonjp-lab/gekichin/blob/cd9431c53d64543c0d49e562dea9ea03d22a609c/src/main.ts"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/gekichin/",
      "candidateUrl": null,
      "deployedCommit": "cd9431c53d64543c0d49e562dea9ea03d22a609c",
      "sourceIsLatestMain": true,
      "checkedAt": "2026-10-10T03:19:35.105627+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, deployment manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned current-main production build compared byte for byte to the current public product assets"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/gekichin/deployment.json",
        "https://github.com/chameleonjp-lab/gekichin/actions/runs/38019866234",
        "https://github.com/chameleonjp-lab/gekichin/tree/cd9431c53d64543c0d49e562dea9ea03d22a609c"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "Current product source and published bytes are verified; full gameplay/release acceptance is not claimed",
        "No title screenshot is claimed for this new deployed source; historical images are not retagged"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "assets/index-BKPe2TDn.css": "29b85fd6c6e25fedbc8591d2d6863d176d820425956827dd761d63ba2aaa408c",
        "assets/index-BcgCHwIl.js": "e8a421537de54698483df7f19ef15ab9845a844e0f2adebb4352b1b0a3da144c",
        "index.html": "f974e38224508984d9886da0f1b0ac2584c8996ab2baeb7f4a82156c67e72735",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "06c9fdcd566e6a620ca9d6847712b0d3a91ae99550cb3b91a740c55caa683dc4",
      "manifestFile": "deployment.json",
      "allProductHashesMatch": true,
      "productFileCount": 4,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 38019866234,
        "runUrl": "https://github.com/chameleonjp-lab/gekichin/actions/runs/38019866234",
        "headCommit": "cd9431c53d64543c0d49e562dea9ea03d22a609c",
        "headBranch": "main",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-10T03:14:34Z",
        "updatedAt": "2026-10-10T03:16:43Z",
        "deployJobId": 114118614825,
        "completedRecordAt": "2026-10-10T03:16:42Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/gekichin/",
        "finalUrl": "https://chameleonjp-lab.github.io/gekichin/",
        "status": 200,
        "sha256": "f974e38224508984d9886da0f1b0ac2584c8996ab2baeb7f4a82156c67e72735",
        "bytes": 610,
        "observedAt": "2026-10-10T03:19:35.105627+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "deploymentManifest": {
        "schema": 1,
        "repository": "chameleonjp-lab/gekichin",
        "commit": "cd9431c53d64543c0d49e562dea9ea03d22a609c",
        "files": [
          {
            "path": "assets/index-BKPe2TDn.css",
            "bytes": 31645,
            "sha256": "29b85fd6c6e25fedbc8591d2d6863d176d820425956827dd761d63ba2aaa408c"
          },
          {
            "path": "assets/index-BcgCHwIl.js",
            "bytes": 752564,
            "sha256": "e8a421537de54698483df7f19ef15ab9845a844e0f2adebb4352b1b0a3da144c"
          },
          {
            "path": "index.html",
            "bytes": 610,
            "sha256": "f974e38224508984d9886da0f1b0ac2584c8996ab2baeb7f4a82156c67e72735"
          },
          {
            "path": "third-party-notices.txt",
            "bytes": 1082,
            "sha256": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
          }
        ],
        "sourceTree": "cd20996628a72ed4128ce8de4135bf1dcdc6392f",
        "workflowCommit": "cd9431c53d64543c0d49e562dea9ea03d22a609c",
        "publicationAuthorizationDate": "2026-10-10",
        "publicationScope": "User-requested verification build; final physical-phone and gameplay acceptance are not claimed"
      }
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-10T03:33:43.645878+00:00"
  },
  {
    "id": "uchiotose",
    "displayOrder": 5,
    "title": "ウチオトセ",
    "description": "味方艦隊と戦闘機で、浮遊島から出撃する飛行戦士と戦う海上空戦ゲーム。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/uchiotose/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/uchiotose",
    "sourceCommit": "0d00ef31a44786e23a0e93aae2bda6d78c15ccdf",
    "sourceRoot": "https://github.com/chameleonjp-lab/uchiotose/tree/0d00ef31a44786e23a0e93aae2bda6d78c15ccdf",
    "sourceObservedAt": "2026-10-10T03:21:38.077195+00:00",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/uchiotose/blob/0d00ef31a44786e23a0e93aae2bda6d78c15ccdf/README.md",
      "https://github.com/chameleonjp-lab/uchiotose/blob/0d00ef31a44786e23a0e93aae2bda6d78c15ccdf/src/main.ts",
      "https://github.com/chameleonjp-lab/uchiotose/blob/0d00ef31a44786e23a0e93aae2bda6d78c15ccdf/README.md"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/uchiotose/",
      "candidateUrl": null,
      "deployedCommit": "0d00ef31a44786e23a0e93aae2bda6d78c15ccdf",
      "sourceIsLatestMain": true,
      "checkedAt": "2026-10-10T03:21:38.077195+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, deployment manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned current-main production build compared byte for byte to the current public product assets"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/uchiotose/deployment.json",
        "https://github.com/chameleonjp-lab/uchiotose/actions/runs/38018823568",
        "https://github.com/chameleonjp-lab/uchiotose/tree/0d00ef31a44786e23a0e93aae2bda6d78c15ccdf"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "Current product source and published bytes are verified; full gameplay/release acceptance is not claimed",
        "No title screenshot is claimed for this new deployed source; historical images are not retagged"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "assets/index-BF7Y2cGw.js": "3338ca7bc302878339bf5471aca43eecc24d2c204d6604cea7949d23bf3261c7",
        "assets/index-CM_NdGef.css": "da43ec868b2376e44fca82231ce10e744bf4435d158bdfc3698576a6aca177b7",
        "index.html": "41d29d4e9dfb63b2a218c965334b014581a3f746f68d3404f9663cb29a16acd4",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "6850bb50df1efdb3e95c4806b654cdd92c24606ead961ce4346b86b9b6ae2d5f",
      "manifestFile": "deployment.json",
      "allProductHashesMatch": true,
      "productFileCount": 4,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_pages_branch",
        "runId": 38018823568,
        "runUrl": "https://github.com/chameleonjp-lab/uchiotose/actions/runs/38018823568",
        "headCommit": "df1827e37d962d14cb75ca8038d0c6bf36c9435b",
        "headBranch": "gh-pages",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-10T02:57:06Z",
        "updatedAt": "2026-10-10T02:57:28Z",
        "deployJobId": 114115088259,
        "completedRecordAt": "2026-10-10T02:57:27Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/uchiotose/",
        "finalUrl": "https://chameleonjp-lab.github.io/uchiotose/",
        "status": 200,
        "sha256": "41d29d4e9dfb63b2a218c965334b014581a3f746f68d3404f9663cb29a16acd4",
        "bytes": 8308,
        "observedAt": "2026-10-10T03:21:38.077195+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "deploymentManifest": {
        "repository": "chameleonjp-lab/uchiotose",
        "commit": "0d00ef31a44786e23a0e93aae2bda6d78c15ccdf",
        "sourceTree": "47945ee0f0bfc36d930dd78392ce9d89d53fd322",
        "files": {
          "assets/index-BF7Y2cGw.js": "3338ca7bc302878339bf5471aca43eecc24d2c204d6604cea7949d23bf3261c7",
          "assets/index-CM_NdGef.css": "da43ec868b2376e44fca82231ce10e744bf4435d158bdfc3698576a6aca177b7",
          "index.html": "41d29d4e9dfb63b2a218c965334b014581a3f746f68d3404f9663cb29a16acd4",
          "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
        },
        "publicationAuthorizationDate": "2026-10-10",
        "publicationScope": "User-requested publication; physical-phone acceptance not claimed"
      },
      "deployedBranchCommit": "df1827e37d962d14cb75ca8038d0c6bf36c9435b",
      "deployedBranchBytesMatch": true
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-10T03:33:43.645878+00:00"
  },
  {
    "id": "senryou",
    "displayOrder": 6,
    "title": "センリョウ",
    "description": "戦闘機で両軍の地上戦へ介入し、歩兵による拠点占領を支援する一戦完結型のゲーム。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/senryou/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/senryou",
    "sourceCommit": "210f6a782f2499367651f9678b383b754d3b1101",
    "sourceRoot": "https://github.com/chameleonjp-lab/senryou/tree/210f6a782f2499367651f9678b383b754d3b1101",
    "sourceObservedAt": "2026-10-10T03:19:35.107698+00:00",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/senryou/blob/210f6a782f2499367651f9678b383b754d3b1101/README.md",
      "https://github.com/chameleonjp-lab/senryou/blob/210f6a782f2499367651f9678b383b754d3b1101/docs/VERIFICATION.md"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/senryou/",
      "candidateUrl": null,
      "deployedCommit": "210f6a782f2499367651f9678b383b754d3b1101",
      "sourceIsLatestMain": true,
      "checkedAt": "2026-10-10T03:19:35.107698+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, deployment manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned current-main production build compared byte for byte to the current public product assets"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/senryou/deployment.json",
        "https://github.com/chameleonjp-lab/senryou/actions/runs/38019994971",
        "https://github.com/chameleonjp-lab/senryou/tree/210f6a782f2499367651f9678b383b754d3b1101"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "Current product source and published bytes are verified; full gameplay/release acceptance is not claimed",
        "No title screenshot is claimed for this new deployed source; historical images are not retagged",
        "Existing crowded world labels in the small landscape HUD remain outside full HUD visibility acceptance; the common Home/settings/Pause/Result shell was reviewed"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "assets/index-CkCmlMuT.css": "480064817b4725f809216694d2b799f560fb957a8701c85e6725d9f68472aeb2",
        "assets/index-Ds8l9eZj.js": "9f4ea213b9a6d01a2bb8478ffa7c772c29c93a1d2949f73440a47aebd2d5ad73",
        "index.html": "2a806eca67f4b6bae96ba33c207e9b5668d6de342425b2fbd9e1d5b603907922",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "06e2cffcfbb6468f2c0e7cd3195b8812d8b8a986bdfedc9eb119a45f82bd4925",
      "manifestFile": "deployment.json",
      "allProductHashesMatch": true,
      "productFileCount": 4,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 38019994971,
        "runUrl": "https://github.com/chameleonjp-lab/senryou/actions/runs/38019994971",
        "headCommit": "210f6a782f2499367651f9678b383b754d3b1101",
        "headBranch": "main",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-10T03:16:43Z",
        "updatedAt": "2026-10-10T03:17:53Z",
        "deployJobId": 114118823138,
        "completedRecordAt": "2026-10-10T03:17:52Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/senryou/",
        "finalUrl": "https://chameleonjp-lab.github.io/senryou/",
        "status": 200,
        "sha256": "2a806eca67f4b6bae96ba33c207e9b5668d6de342425b2fbd9e1d5b603907922",
        "bytes": 11545,
        "observedAt": "2026-10-10T03:19:35.107698+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "deploymentManifest": {
        "repository": "chameleonjp-lab/senryou",
        "commit": "210f6a782f2499367651f9678b383b754d3b1101",
        "files": {
          "assets/index-CkCmlMuT.css": "480064817b4725f809216694d2b799f560fb957a8701c85e6725d9f68472aeb2",
          "assets/index-Ds8l9eZj.js": "9f4ea213b9a6d01a2bb8478ffa7c772c29c93a1d2949f73440a47aebd2d5ad73",
          "index.html": "2a806eca67f4b6bae96ba33c207e9b5668d6de342425b2fbd9e1d5b603907922",
          "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
        },
        "sourceTree": "e87b20f0484e0235061cd925fb91913a3591554d",
        "workflowCommit": "210f6a782f2499367651f9678b383b754d3b1101",
        "publicationAuthorizationDate": "2026-10-10",
        "publicationScope": "User-requested verification build; final physical-phone and gameplay acceptance are not claimed"
      }
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-10T03:33:43.645878+00:00"
  },
  {
    "id": "fantasia",
    "displayOrder": 7,
    "title": "ファンタジア",
    "description": "剣と魔法の世界で、7方面へ進む味方軍を戦闘機で支援する占領戦タイムアタック。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/fantasia/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/fantasia",
    "sourceCommit": "7b59137065ae7af26b37f0fa304c16bf7483ed50",
    "sourceRoot": "https://github.com/chameleonjp-lab/fantasia/tree/7b59137065ae7af26b37f0fa304c16bf7483ed50",
    "sourceObservedAt": "2026-10-10T03:32:26.386694+00:00",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/fantasia/blob/7b59137065ae7af26b37f0fa304c16bf7483ed50/README.md",
      "https://github.com/chameleonjp-lab/fantasia/blob/7b59137065ae7af26b37f0fa304c16bf7483ed50/docs/RELEASE_GATE.json",
      "https://github.com/chameleonjp-lab/fantasia/blob/7b59137065ae7af26b37f0fa304c16bf7483ed50/docs/DELIVERY_STATUS.md"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/fantasia/",
      "candidateUrl": null,
      "deployedCommit": "7b59137065ae7af26b37f0fa304c16bf7483ed50",
      "sourceIsLatestMain": true,
      "checkedAt": "2026-10-10T03:32:26.386694+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, deployment manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned current-main production build compared byte for byte to the current public product assets"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/fantasia/deployment.json",
        "https://github.com/chameleonjp-lab/fantasia/actions/runs/38020805395",
        "https://github.com/chameleonjp-lab/fantasia/tree/7b59137065ae7af26b37f0fa304c16bf7483ed50"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "Current product source and published bytes are verified; full gameplay/release acceptance is not claimed",
        "No title screenshot is claimed for this new deployed source; historical images are not retagged",
        "docs/RELEASE_GATE.json remains ready:false; this user-requested verification publication does not complete its formal gameplay and physical-phone acceptance"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "assets/index-BOqdvI6-.css": "5070fa014994f06eadf7c2325c05c494968cbf03bb313f2ca99b3dc551c723b4",
        "assets/index-Q6uXPGvk.js": "9bb935d5a401600caab414ca027afd61b27c1ee3a3331ba402828f15f589fd9d",
        "index.html": "218e681cedc5da3afbc9e3c9e1b8ad2f6f7fd400d822744379d9892a6bd328d7",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "ee72333c50c1e59545b8de40775b25fd925d8275cc640972bdff35f73e0c12bb",
      "manifestFile": "deployment.json",
      "allProductHashesMatch": true,
      "productFileCount": 4,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": true,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 38020805395,
        "runUrl": "https://github.com/chameleonjp-lab/fantasia/actions/runs/38020805395",
        "headCommit": "7b59137065ae7af26b37f0fa304c16bf7483ed50",
        "headBranch": "main",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-10T03:30:35Z",
        "updatedAt": "2026-10-10T03:32:07Z",
        "deployJobId": 114121401375,
        "completedRecordAt": "2026-10-10T03:32:06Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/fantasia/",
        "finalUrl": "https://chameleonjp-lab.github.io/fantasia/",
        "status": 200,
        "sha256": "218e681cedc5da3afbc9e3c9e1b8ad2f6f7fd400d822744379d9892a6bd328d7",
        "bytes": 12347,
        "observedAt": "2026-10-10T03:32:26.386694+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "deploymentManifest": {
        "repository": "chameleonjp-lab/fantasia",
        "commit": "7b59137065ae7af26b37f0fa304c16bf7483ed50",
        "files": {
          "assets/index-BOqdvI6-.css": "5070fa014994f06eadf7c2325c05c494968cbf03bb313f2ca99b3dc551c723b4",
          "assets/index-Q6uXPGvk.js": "9bb935d5a401600caab414ca027afd61b27c1ee3a3331ba402828f15f589fd9d",
          "index.html": "218e681cedc5da3afbc9e3c9e1b8ad2f6f7fd400d822744379d9892a6bd328d7",
          "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
        },
        "sourceTree": "ceda209512a84035e6070113ff6d24140b3a2a95",
        "workflowCommit": "7b59137065ae7af26b37f0fa304c16bf7483ed50",
        "publicationAuthorizationDate": "2026-10-10",
        "publicationScope": "User-requested verification build; final physical-phone and gameplay acceptance are not claimed"
      },
      "releaseGateReady": false
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-10T03:33:43.645878+00:00"
  },
  {
    "id": "nusumidase",
    "displayOrder": 8,
    "title": "ヌスミダセ",
    "description": "敵の空中基地から機密コアを奪い、僚機とともに自基地へ持ち帰る、一人用の空中旗取りゲームを予定しています。仕様・実装計画を整備中です。",
    "releaseState": "preparing",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/nusumidase",
    "sourceCommit": "c604c7990e5ba9a599898ede6c1ccb4b42970b51",
    "sourceRoot": "https://github.com/chameleonjp-lab/nusumidase/tree/c604c7990e5ba9a599898ede6c1ccb4b42970b51",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/REQUIREMENTS.md",
      "https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/IMPLEMENTATION_PLAN.md"
    ],
    "publicationEvidence": {
      "verified": false,
      "officialUrl": null,
      "candidateUrl": null,
      "deployedCommit": null,
      "checkedAt": "2026-10-09T14:46:27Z",
      "method": [
        "Current main pinned SHA, README and all official source documents searched",
        "Repository metadata, gh-pages branch presence, and Actions runs read independently"
      ],
      "sources": [
        "https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/REQUIREMENTS.md",
        "https://github.com/chameleonjp-lab/nusumidase/blob/c604c7990e5ba9a599898ede6c1ccb4b42970b51/docs/IMPLEMENTATION_PLAN.md"
      ],
      "unknown": [
        "No official current play URL or deployed source commit could be established from the main README, documentation, HTML, JSON, workflows, or public branch/run records",
        "has_pages=true is observed repository configuration and does not establish a playable release",
        "Current main contains README and two specification/planning documents only; no implementation or Actions run is present"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "deploymentRecord": null,
      "artifactHashes": {}
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-09T14:58:37.293190+00:00"
  }
];

const validSha = value => /^[a-f0-9]{40}$/.test(value ?? '');
const validHash = value => /^[a-f0-9]{64}$/.test(value ?? '');
const validDate = value => typeof value==='string' && Number.isFinite(Date.parse(value));

/** Exact, evidence-backed play URLs; latest main is independent of deployment. */
export function getPlayableUrl(entry) {
  if (!entry || entry.releaseState!=='published') return null;
  const proof=entry.publicationEvidence;
  const expected=Object.hasOwn(OFFICIAL_PLAY_URLS,entry.id)?OFFICIAL_PLAY_URLS[entry.id]:null;
  if (!expected || entry.playUrl!==expected || proof?.officialUrl!==expected
    || proof.verified!==true || !validSha(proof.deployedCommit) || !validDate(proof.checkedAt)
    || proof.allProductHashesMatch!==true || proof.deployedSourceProductBytesMatch!==true
    || !validHash(proof.manifestSha256) || !validHash(proof.artifactHashes?.['index.html'])
    || proof.deploymentRecord?.conclusion!=='success' || proof.deploymentRecord?.deployJobConclusion!=='success'
    || proof.deploymentRecord.headCommit!==(proof.deployedBranchCommit ?? proof.deployedCommit)) return null;
  try {
    const url=new URL(entry.playUrl);
    return url.protocol==='https:' && !url.username && !url.password && !url.search && !url.hash ? url.href : null;
  } catch {return null;}
}

/** A real image must stay bound to its pinned source, bytes, and capture record. */
export function validateThumbnail(game) {
  const image=game.thumbnail;
  if (image===null) return true;
  const evidence=image?.evidence;
  if (!image || image.kind!=='title_screen' || !validHash(image.version)
    || typeof image.alt!=='string' || !image.alt.trim() || typeof image.caption!=='string' || !image.caption.trim()
    || !Array.isArray(image.variants) || image.variants.length!==2
    || !validSha(evidence?.sourceCommit) || !validSha(evidence?.deployedCommit)
    || evidence.sourceCommit!==evidence.deployedCommit || evidence.deployedCommit!==game.publicationEvidence.deployedCommit
    || !getPlayableUrl(game) || evidence.sourceUrl!==game.playUrl || !validDate(evidence.capturedAt)
    || typeof evidence.rights!=='string' || !evidence.rights.trim()
    || evidence.evidenceFile!=='docs/evidence/images-current.json') throw new TypeError('Invalid screenshot provenance');
  for (const [index,variant] of image.variants.entries()) {
    if (variant.width!==[640,960][index] || !Number.isInteger(variant.height) || variant.height<=0
      || variant.height>4000 || !validHash(variant.sha256)
      || !new RegExp(`^assets/screenshots/${game.id}-[a-f0-9]{12}-${variant.width}\\.webp$`).test(variant.src)) throw new TypeError('Invalid screenshot asset');
  }
  return true;
}

/** Reject unverified publication, image, and ranking activation at build time. */
export function validateCatalog(entries=catalog) {
  const ids=['kaisen','faitofuraito','machimamore','gekichin','uchiotose','senryou','fantasia','nusumidase'];
  if (!Array.isArray(entries) || entries.length!==ids.length) throw new TypeError('Catalog must contain exactly eight games');
  entries.forEach((entry,index)=>{
    const repo=`https://github.com/chameleonjp-lab/${ids[index]}`;
    if (entry?.id!==ids[index] || entry.displayOrder!==index+1) throw new TypeError('Invalid catalog order or game identifier');
    if (typeof entry.title!=='string' || !entry.title.trim() || typeof entry.description!=='string' || !entry.description.trim()
      || !validSha(entry.sourceCommit) || !validDate(entry.sourceObservedAt)) throw new TypeError('Missing catalog source or description');
    if (entry.repositoryUrl!==repo || entry.sourceRoot!==`${repo}/tree/${entry.sourceCommit}`) throw new TypeError('Invalid repository provenance');
    if (!['published','preparing','unverified'].includes(entry.releaseState)) throw new TypeError('Invalid publication state');
    if (entry.releaseState==='published' ? getPlayableUrl(entry)!==entry.playUrl || !entry.playUrl : entry.playUrl!==null) throw new TypeError('Unverified play URL');
    const ranking=entry.ranking;
    if (!ranking || !Array.isArray(ranking.modes) || typeof ranking.enabled!=='boolean'
      || !['not_connected','stopped','ready'].includes(ranking.displayState)
      || new Set(ranking.modes.map(mode=>mode.id)).size!==ranking.modes.length
      || (ranking.modes.length ? !ranking.modes.some(mode=>mode.id===ranking.defaultMode) : ranking.defaultMode!==null)
      || !validateRankingConnection(entry)) throw new TypeError('Ranking activation requires a verified fixed production binding');
    validateThumbnail(entry);
  });
  return true;
}

export default catalog;
