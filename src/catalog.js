// Fixed eight-title allowlist. Current main, deployment and capture are distinct.
// Full read-only evidence: docs/evidence/current-games.json and images-current.json.
import {validateRankingConnection} from './ranking/reader.js';
export const OFFICIAL_PLAY_URLS = Object.freeze({
  kaisen:'https://chameleonjp-lab.github.io/kaisen/',
  faitofuraito:'https://chameleonjp-lab.github.io/faitofuraito/',
  machimamore:'https://chameleonjp-lab.github.io/machimamore/',
  gekichin:'https://chameleonjp-lab.github.io/gekichin/',
  uchiotose:'https://chameleonjp-lab.github.io/uchiotose/',
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
    "sourceCommit": "192c075532a8f0d2810a444ae5ac299cdfec9f1a",
    "sourceRoot": "https://github.com/chameleonjp-lab/machimamore/tree/192c075532a8f0d2810a444ae5ac299cdfec9f1a",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/machimamore/blob/192c075532a8f0d2810a444ae5ac299cdfec9f1a/README.md",
      "https://github.com/chameleonjp-lab/machimamore/blob/192c075532a8f0d2810a444ae5ac299cdfec9f1a/src/main.ts",
      "https://github.com/chameleonjp-lab/machimamore/blob/1d27a697ea62dbfa676e1e78968c164552459ec5/README.md"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/machimamore/",
      "candidateUrl": null,
      "deployedCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
      "sourceIsLatestMain": false,
      "checkedAt": "2026-10-09T14:49:02.751924+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned deployed-source production build compared byte for byte to the current public product assets",
        "Current deployed bytes were replayed offline in a fresh Chromium context; the actual Home/title pixels were captured and reviewed without any start or input operation"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/machimamore/deployment.json",
        "https://github.com/chameleonjp-lab/machimamore/actions/runs/37394426765",
        "https://github.com/chameleonjp-lab/machimamore/tree/1d27a697ea62dbfa676e1e78968c164552459ec5",
        "docs/evidence/images-current.json"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "This observation does not prove all game features or release acceptance completed",
        "Latest main includes later source changes; those changes are not claimed to be present in this public deployment",
        "The Home observation is offline replay of exact deployed bytes; no direct live browser or combat-screen acceptance is claimed"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "artifact-manifest.json": "57742db53f439b2641c8c4b6f8eab3cf3264d9217cce217002531d58f3111589",
        "assets/index-BAyulP5k.css": "52bee58f42cf2b7d73afc93ba89df8a27f15cd117f74a857c8d852c602516d65",
        "assets/index-CX-kywWz.js": "9d04640ab8527e2b90fae88da3a455d7ca1da658eb0b20d21da04e1202dcceb0",
        "index.html": "dae5e25fd272dcf1115e7af756565e940271db243102c5af9a4f2ab6a0947d79",
        "third-party-notices.txt": "8b378ebe60e2fe500158cb0ac71cb5e8b7d92953c2abcc63a0eb90499653b5bc"
      },
      "manifestSha256": "ab92295564225afb5fe84a8b4c9596f3537ed3efdf5df43cd309e0d3d8626d8a",
      "allProductHashesMatch": true,
      "productFileCount": 5,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": null,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 37394426765,
        "runUrl": "https://github.com/chameleonjp-lab/machimamore/actions/runs/37394426765",
        "headCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
        "headBranch": "main",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-06T00:31:06Z",
        "updatedAt": "2026-10-06T00:37:53Z",
        "deployJobId": 112048717497,
        "completedRecordAt": "2026-10-06T00:37:52Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "sourceContentDigest": "f5cf45e8fc5907fcd8113596c8fb14d6d1e461e34f428547ae5fb9610bd41043",
      "sourceManifestSha256": "c9ef9cd15a779cf1e0a5715ef39d39e3efdc367d8f12f5d07857ac4d8831725b",
      "sourceValidation": {
        "sourceCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
        "sourceInputFileCount": 81,
        "sourceContentDigest": "f5cf45e8fc5907fcd8113596c8fb14d6d1e461e34f428547ae5fb9610bd41043",
        "matchesPublicDeploymentDigest": true
      },
      "deploymentManifestMatchesIndependentBuild": null,
      "manifestVariance": "All five product files match the independent deployed-source build. The CI-only source-manifest generation timestamp and deployment.json were not reconstructed or claimed to match a new build.",
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/machimamore/",
        "finalUrl": "https://chameleonjp-lab.github.io/machimamore/",
        "status": 200,
        "sha256": "dae5e25fd272dcf1115e7af756565e940271db243102c5af9a4f2ab6a0947d79",
        "bytes": 8611,
        "observedAt": "2026-10-09T15:02:33.300445+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "homeCheck": {
        "sourceCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
        "deployedCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
        "checkedAt": "2026-10-09T15:15:53.817Z",
        "appliesToCurrentDeployedSource": true,
        "appliesToLatestMain": false,
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
          "note": "Fresh browser context. Requests were fulfilled only from exact URL/path entries whose bytes matched the TLS-verified observation hashes; all unknown URLs and methods other than GET/HEAD were set to abort. No external request was fulfilled or blocked because none was attempted.",
          "servedProductRequests": [
            {
              "path": "index.html",
              "sha256": "dae5e25fd272dcf1115e7af756565e940271db243102c5af9a4f2ab6a0947d79",
              "method": "GET"
            },
            {
              "path": "assets/index-CX-kywWz.js",
              "sha256": "9d04640ab8527e2b90fae88da3a455d7ca1da658eb0b20d21da04e1202dcceb0",
              "method": "GET"
            },
            {
              "path": "assets/index-BAyulP5k.css",
              "sha256": "52bee58f42cf2b7d73afc93ba89df8a27f15cd117f74a857c8d852c602516d65",
              "method": "GET"
            }
          ]
        },
        "gameplayScreenshotAccepted": false,
        "originalScreenshotSha256": "883dc35fd2d1609c7f7df695e2f46acc9e56791942e14e4d3956535c042b552c",
        "capturedAt": "2026-10-09T15:15:53.817Z",
        "screenshotOutputs": [
          {
            "src": "assets/screenshots/machimamore-883dc35fd2d1-960.webp",
            "width": 960,
            "height": 540,
            "sha256": "2456ee11143dfc04f29fde56cfe4bb842d3f59669d0d5535866d3c3433f14cb4",
            "bytes": 29876,
            "format": "image/webp"
          },
          {
            "src": "assets/screenshots/machimamore-883dc35fd2d1-640.webp",
            "width": 640,
            "height": 360,
            "sha256": "3ea926bc89999c89ab8ae86b1240d8c0f2f5fbe9b747665d3cb6888485a295e8",
            "bytes": 16392,
            "format": "image/webp"
          }
        ],
        "startEnabled": true,
        "startLabel": "街を守りに出撃",
        "startPressed": false,
        "homeReadiness": {
          "ready": true,
          "signal": "Start enabled with the published ready label after prepareGraphics; startup-error hidden",
          "startEnabled": true,
          "startLabel": "街を守りに出撃",
          "statusVisible": false,
          "statusText": null,
          "graphicsError": null,
          "timedOut": false,
          "timeoutMs": 20000,
          "waitedMs": 2497
        }
      }
    },
    "thumbnail": {
      "kind": "title_screen",
      "version": "883dc35fd2d1609c7f7df695e2f46acc9e56791942e14e4d3956535c042b552c",
      "variants": [
        {
          "src": "assets/screenshots/machimamore-883dc35fd2d1-640.webp",
          "width": 640,
          "height": 360,
          "sha256": "3ea926bc89999c89ab8ae86b1240d8c0f2f5fbe9b747665d3cb6888485a295e8",
          "bytes": 16392,
          "format": "image/webp"
        },
        {
          "src": "assets/screenshots/machimamore-883dc35fd2d1-960.webp",
          "width": 960,
          "height": 540,
          "sha256": "2456ee11143dfc04f29fde56cfe4bb842d3f59669d0d5535866d3c3433f14cb4",
          "bytes": 29876,
          "format": "image/webp"
        }
      ],
      "alt": "マチマモレの公開版タイトル画面。街と海の背景にUFOが浮かび、画面右側にモード選択と有効な出撃ボタン「街を守りに出撃」が表示されている。",
      "caption": "公開版のタイトル画面（描画準備完了後、開始前。戦闘画面ではありません）。",
      "evidence": {
        "sourceUrl": "https://chameleonjp-lab.github.io/machimamore/",
        "sourceCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
        "deployedCommit": "1d27a697ea62dbfa676e1e78968c164552459ec5",
        "capturedAt": "2026-10-09T15:15:53.817Z",
        "rights": "このタスクでユーザーが公開製品画面の撮影とポータル掲載用派生を明示承認。製品リポジトリ全体のライセンスとは主張しない。公開版NOTICEはThree.jsのMIT表示のみ。製品資料に記された画面素材の来歴はrightsBasisを参照。",
        "evidenceFile": "docs/evidence/images-current.json",
        "originalSha256": "883dc35fd2d1609c7f7df695e2f46acc9e56791942e14e4d3956535c042b552c",
        "derivatives": [
          {
            "src": "assets/screenshots/machimamore-883dc35fd2d1-960.webp",
            "sha256": "2456ee11143dfc04f29fde56cfe4bb842d3f59669d0d5535866d3c3433f14cb4"
          },
          {
            "src": "assets/screenshots/machimamore-883dc35fd2d1-640.webp",
            "sha256": "3ea926bc89999c89ab8ae86b1240d8c0f2f5fbe9b747665d3cb6888485a295e8"
          }
        ],
        "rightsBasis": [
          {
            "path": "docs/PROVENANCE.md",
            "url": "https://github.com/chameleonjp-lab/machimamore/blob/1d27a697ea62dbfa676e1e78968c164552459ec5/docs/PROVENANCE.md"
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
    "id": "gekichin",
    "displayOrder": 4,
    "title": "ゲキチン",
    "description": "超大型母艦の100基の砲台を、僚機と破壊するタイム・スコアアタック。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/gekichin/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/gekichin",
    "sourceCommit": "01d9d9ccf5ff3e4cf7134ed3c08c999d879319d3",
    "sourceRoot": "https://github.com/chameleonjp-lab/gekichin/tree/01d9d9ccf5ff3e4cf7134ed3c08c999d879319d3",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/gekichin/blob/01d9d9ccf5ff3e4cf7134ed3c08c999d879319d3/src/main.ts",
      "https://github.com/chameleonjp-lab/gekichin/blob/01d9d9ccf5ff3e4cf7134ed3c08c999d879319d3/docs/IMPLEMENTATION_STATUS.md",
      "https://github.com/chameleonjp-lab/gekichin/blob/de500c3e0e077fe2bab636dc2a382a8796ea8b9e/src/main.ts"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/gekichin/",
      "candidateUrl": null,
      "deployedCommit": "de500c3e0e077fe2bab636dc2a382a8796ea8b9e",
      "sourceIsLatestMain": false,
      "checkedAt": "2026-10-09T14:49:02.674629+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned deployed-source production build compared byte for byte to the current public product assets",
        "Current deployed bytes were replayed offline in a fresh Chromium context; the actual Home/title pixels were captured and reviewed without any start or input operation"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/gekichin/deployment.json",
        "https://github.com/chameleonjp-lab/gekichin/actions/runs/37476863919",
        "https://github.com/chameleonjp-lab/gekichin/tree/de500c3e0e077fe2bab636dc2a382a8796ea8b9e",
        "docs/evidence/images-current.json"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "This observation does not prove all game features or release acceptance completed",
        "Latest main includes later source changes; those changes are not claimed to be present in this public deployment",
        "The Home observation is offline replay of exact deployed bytes; no direct live browser or combat-screen acceptance is claimed"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        "assets/index-BufJBCcE.css": "d89927dcc6ca023fc4eb27a7d824215101184aeac9f2505e117eb80b76bb89bf",
        "assets/index-Ca9XU86d.js": "75a38d906ca0775e2a1b7322366f3dfeb97a00edfd817ca00efc6f356f34cb9c",
        "index.html": "1856e5b784410ffd8af94e7c8610f9def8ed0bc3f157062c28a7dd80c9b09b6a",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "7fd7fedf350fa67948a113ef9aebfe90049a876354354675a5debbe88e820964",
      "allProductHashesMatch": true,
      "productFileCount": 4,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": null,
      "deploymentRecord": {
        "kind": "github_actions",
        "runId": 37476863919,
        "runUrl": "https://github.com/chameleonjp-lab/gekichin/actions/runs/37476863919",
        "headCommit": "de500c3e0e077fe2bab636dc2a382a8796ea8b9e",
        "headBranch": "main",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-06T14:11:20Z",
        "updatedAt": "2026-10-06T14:21:21Z",
        "deployJobId": 112319141560,
        "completedRecordAt": "2026-10-06T14:21:20Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/gekichin/",
        "finalUrl": "https://chameleonjp-lab.github.io/gekichin/",
        "status": 200,
        "sha256": "1856e5b784410ffd8af94e7c8610f9def8ed0bc3f157062c28a7dd80c9b09b6a",
        "bytes": 610,
        "observedAt": "2026-10-09T15:02:33.299530+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "homeCheck": {
        "sourceCommit": "de500c3e0e077fe2bab636dc2a382a8796ea8b9e",
        "deployedCommit": "de500c3e0e077fe2bab636dc2a382a8796ea8b9e",
        "checkedAt": "2026-10-09T14:54:53.424Z",
        "appliesToCurrentDeployedSource": true,
        "appliesToLatestMain": false,
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
        "homeRendererVisible": false,
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
        "originalScreenshotSha256": "214e1a7181abb4b8c7da3a51b9cd0a3f74eb1cbfac55210d81662638049a329d"
      }
    },
    "thumbnail": {
      "kind": "title_screen",
      "version": "214e1a7181abb4b8c7da3a51b9cd0a3f74eb1cbfac55210d81662638049a329d",
      "variants": [
        {
          "src": "assets/screenshots/gekichin-214e1a7181ab-640.webp",
          "width": 640,
          "height": 360,
          "sha256": "72c69f278bef4a9193e4c844fb8947ee1bd19361dc51ee4b22eb3d1c36aca47c",
          "bytes": 9266,
          "format": "image/webp"
        },
        {
          "src": "assets/screenshots/gekichin-214e1a7181ab-960.webp",
          "width": 960,
          "height": 540,
          "sha256": "a8bbbabb9e6529934249b350fd11a66cf2ed21e2b506479a52221c0ef77263bb",
          "bytes": 17328,
          "format": "image/webp"
        }
      ],
      "alt": "ゲキチンの公開版タイトル画面。中央のパネルにタイトル、母艦と砲台の説明、モード選択と開始ボタンが表示され、背景は暗い空と水平線。",
      "caption": "公開版のタイトル画面（戦闘画面ではありません）。",
      "evidence": {
        "sourceUrl": "https://chameleonjp-lab.github.io/gekichin/",
        "sourceCommit": "de500c3e0e077fe2bab636dc2a382a8796ea8b9e",
        "deployedCommit": "de500c3e0e077fe2bab636dc2a382a8796ea8b9e",
        "capturedAt": "2026-10-09T14:54:53.424Z",
        "rights": "このタスクでユーザーが公開製品画面の撮影とポータル掲載用派生を明示承認。製品リポジトリ全体のライセンスとは主張しない。公開版NOTICEはThree.jsのMIT表示のみ。製品資料に記された画面素材の来歴はrightsBasisを参照。",
        "evidenceFile": "docs/evidence/images-current.json",
        "originalSha256": "214e1a7181abb4b8c7da3a51b9cd0a3f74eb1cbfac55210d81662638049a329d",
        "derivatives": [
          {
            "src": "assets/screenshots/gekichin-214e1a7181ab-640.webp",
            "sha256": "72c69f278bef4a9193e4c844fb8947ee1bd19361dc51ee4b22eb3d1c36aca47c"
          },
          {
            "src": "assets/screenshots/gekichin-214e1a7181ab-960.webp",
            "sha256": "a8bbbabb9e6529934249b350fd11a66cf2ed21e2b506479a52221c0ef77263bb"
          }
        ],
        "rightsBasis": [
          {
            "path": "docs/P0_BASELINE.md",
            "url": "https://github.com/chameleonjp-lab/gekichin/blob/de500c3e0e077fe2bab636dc2a382a8796ea8b9e/docs/P0_BASELINE.md"
          },
          {
            "path": "docs/COMBAT_PROVENANCE.md",
            "url": "https://github.com/chameleonjp-lab/gekichin/blob/de500c3e0e077fe2bab636dc2a382a8796ea8b9e/docs/COMBAT_PROVENANCE.md"
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
    "id": "uchiotose",
    "displayOrder": 5,
    "title": "ウチオトセ",
    "description": "味方艦隊と戦闘機で、浮遊島から出撃する飛行戦士と戦う海上空戦ゲーム。イージーとノーマルで挑戦できます。",
    "releaseState": "published",
    "playUrl": "https://chameleonjp-lab.github.io/uchiotose/",
    "repositoryUrl": "https://github.com/chameleonjp-lab/uchiotose",
    "sourceCommit": "7506b4c883f7ed0154f6bb3ddc902e62a73eb2c8",
    "sourceRoot": "https://github.com/chameleonjp-lab/uchiotose/tree/7506b4c883f7ed0154f6bb3ddc902e62a73eb2c8",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/uchiotose/blob/7506b4c883f7ed0154f6bb3ddc902e62a73eb2c8/README.md",
      "https://github.com/chameleonjp-lab/uchiotose/blob/7506b4c883f7ed0154f6bb3ddc902e62a73eb2c8/src/main.ts",
      "https://github.com/chameleonjp-lab/uchiotose/blob/2a7e815c70baf9dc65721fc938909b6ab083f074/README.md"
    ],
    "publicationEvidence": {
      "verified": true,
      "officialUrl": "https://chameleonjp-lab.github.io/uchiotose/",
      "candidateUrl": null,
      "deployedCommit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
      "sourceIsLatestMain": false,
      "checkedAt": "2026-10-09T14:49:03.013507+00:00",
      "method": [
        "TLS-verified HTTPS GET of the official HTML, manifest, and every current product file; SHA-256 comparison",
        "Successful corresponding GitHub Pages Actions run and deploy job read independently",
        "Pinned deployed-source production build compared byte for byte to the current public product assets",
        "All observed public files, including the manifest, match the exact gh-pages branch tree",
        "Current deployed bytes were replayed offline in a fresh Chromium context; the actual Home/title pixels were captured and reviewed without any start or input operation"
      ],
      "sources": [
        "https://chameleonjp-lab.github.io/uchiotose/release.json",
        "https://github.com/chameleonjp-lab/uchiotose/actions/runs/37439104263",
        "https://github.com/chameleonjp-lab/uchiotose/tree/2a7e815c70baf9dc65721fc938909b6ab083f074",
        "docs/evidence/images-current.json"
      ],
      "unknown": [
        "Game start, live gameplay, score submission, physical iPhone, human controls, GPU performance and audio acceptance were not performed",
        "This observation does not prove all game features or release acceptance completed",
        "Latest main includes later source changes; those changes are not claimed to be present in this public deployment",
        "The Home observation is offline replay of exact deployed bytes; no direct live browser or combat-screen acceptance is claimed"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "artifactHashes": {
        ".nojekyll": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "assets/index-6rKQhKs9.js": "43c37845c5c40f00a614d813d5f68dad97d5d73ef46161725494bd19702cc639",
        "assets/index-jjlx_KNJ.css": "2dfeffc8772c95dc1673934db5bf8048ddde79d6e3a541dbf81dcaf3b36d1382",
        "index.html": "57062efb52f8ce0a2f3784b0a5f3de25a309c28b85061749b39501a5622b9b3e",
        "release.json": "912aa5163fc46ab06aa80387c475ca1abef960c72f27ef0a49f43a3fc4180cb7",
        "third-party-notices.txt": "97de7ac302052bcea7f20e5ae89635c10e049614f56409288d554d63fceb614f"
      },
      "manifestSha256": "912aa5163fc46ab06aa80387c475ca1abef960c72f27ef0a49f43a3fc4180cb7",
      "allProductHashesMatch": true,
      "productFileCount": 6,
      "deployedSourceProductBytesMatch": true,
      "currentMainProductBytesMatch": null,
      "deploymentRecord": {
        "kind": "github_pages_branch",
        "runId": 37439104263,
        "runUrl": "https://github.com/chameleonjp-lab/uchiotose/actions/runs/37439104263",
        "headCommit": "1307117008dc72f9031a8c345b6ac077fc8ff30b",
        "headBranch": "gh-pages",
        "status": "completed",
        "conclusion": "success",
        "createdAt": "2026-10-06T08:52:59Z",
        "updatedAt": "2026-10-06T08:53:22Z",
        "deployJobId": 112188202107,
        "completedRecordAt": "2026-10-06T08:53:21Z",
        "deployJobConclusion": "success"
      },
      "deployedArtifactBytesMatch": null,
      "deployedBranchCommit": "1307117008dc72f9031a8c345b6ac077fc8ff30b",
      "deployedBranchBytesMatch": true,
      "releaseManifest": {
        "commit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
        "rulesVersion": "uchiotose-1",
        "ranking": false
      },
      "entryUrlObservation": {
        "url": "https://chameleonjp-lab.github.io/uchiotose/",
        "finalUrl": "https://chameleonjp-lab.github.io/uchiotose/",
        "status": 200,
        "sha256": "57062efb52f8ce0a2f3784b0a5f3de25a309c28b85061749b39501a5622b9b3e",
        "bytes": 7456,
        "observedAt": "2026-10-09T15:02:33.299999+00:00",
        "matchesObservedIndexHtml": true,
        "tlsVerificationEnabled": true
      },
      "homeCheck": {
        "sourceCommit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
        "deployedCommit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
        "checkedAt": "2026-10-09T15:16:22.225Z",
        "appliesToCurrentDeployedSource": true,
        "appliesToLatestMain": false,
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
          "note": "Fresh browser context. Requests were fulfilled only from exact URL/path entries whose bytes matched the TLS-verified observation hashes; all unknown URLs and methods other than GET/HEAD were set to abort. No external request was fulfilled or blocked because none was attempted.",
          "servedProductRequests": [
            {
              "path": "index.html",
              "sha256": "57062efb52f8ce0a2f3784b0a5f3de25a309c28b85061749b39501a5622b9b3e",
              "method": "GET"
            },
            {
              "path": "assets/index-6rKQhKs9.js",
              "sha256": "43c37845c5c40f00a614d813d5f68dad97d5d73ef46161725494bd19702cc639",
              "method": "GET"
            },
            {
              "path": "assets/index-jjlx_KNJ.css",
              "sha256": "2dfeffc8772c95dc1673934db5bf8048ddde79d6e3a541dbf81dcaf3b36d1382",
              "method": "GET"
            }
          ]
        },
        "gameplayScreenshotAccepted": false,
        "originalScreenshotSha256": "f1e85d80c44b272e6431ea95220b03973ef80648c105e0fe1fa88b7ed66794a9",
        "capturedAt": "2026-10-09T15:16:22.225Z",
        "screenshotOutputs": [
          {
            "src": "assets/screenshots/uchiotose-f1e85d80c44b-960.webp",
            "width": 960,
            "height": 540,
            "sha256": "e356e4a0b73b1a9f8c45567b70b390a8a5ed366ef12fe67c336e503e80adc935",
            "bytes": 13140,
            "format": "image/webp"
          },
          {
            "src": "assets/screenshots/uchiotose-f1e85d80c44b-640.webp",
            "width": 640,
            "height": 360,
            "sha256": "dad5894b8ed5ad7ab6ae34b4b34fb004df88dd1c1e4abbb8e30b19081f644c4f",
            "bytes": 7836,
            "format": "image/webp"
          }
        ],
        "startEnabled": true,
        "startLabel": "作戦開始 ↗",
        "startPressed": false,
        "homeReadiness": {
          "ready": true,
          "signal": "Start enabled and #p1-status hidden after renderer.prepare and pollRender ready",
          "startEnabled": true,
          "startLabel": "作戦開始 ↗",
          "statusVisible": false,
          "statusText": "準備完了 · 操作設定とルールを確認して出撃できます",
          "graphicsError": null,
          "timedOut": false,
          "timeoutMs": 20000,
          "waitedMs": 2511
        }
      }
    },
    "thumbnail": {
      "kind": "title_screen",
      "version": "f1e85d80c44b272e6431ea95220b03973ef80648c105e0fe1fa88b7ed66794a9",
      "variants": [
        {
          "src": "assets/screenshots/uchiotose-f1e85d80c44b-640.webp",
          "width": 640,
          "height": 360,
          "sha256": "dad5894b8ed5ad7ab6ae34b4b34fb004df88dd1c1e4abbb8e30b19081f644c4f",
          "bytes": 7836,
          "format": "image/webp"
        },
        {
          "src": "assets/screenshots/uchiotose-f1e85d80c44b-960.webp",
          "width": 960,
          "height": 540,
          "sha256": "e356e4a0b73b1a9f8c45567b70b390a8a5ed366ef12fe67c336e503e80adc935",
          "bytes": 13140,
          "format": "image/webp"
        }
      ],
      "alt": "ウチオトセの公開版タイトル画面。浮遊島と自機・艦隊の製品3D背景に、ゲーム名、戦力数、モード選択と有効な作戦開始ボタンが表示されている。",
      "caption": "公開版のタイトル画面（描画準備完了後、開始前。戦闘画面ではありません）。",
      "evidence": {
        "sourceUrl": "https://chameleonjp-lab.github.io/uchiotose/",
        "sourceCommit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
        "deployedCommit": "2a7e815c70baf9dc65721fc938909b6ab083f074",
        "deployedBranchCommit": "1307117008dc72f9031a8c345b6ac077fc8ff30b",
        "capturedAt": "2026-10-09T15:16:22.225Z",
        "rights": "このタスクでユーザーが公開製品画面の撮影とポータル掲載用派生を明示承認。製品リポジトリ全体のライセンスとは主張しない。公開版NOTICEはThree.jsのMIT表示のみ。製品資料に記された画面素材の来歴はrightsBasisを参照。",
        "evidenceFile": "docs/evidence/images-current.json",
        "originalSha256": "f1e85d80c44b272e6431ea95220b03973ef80648c105e0fe1fa88b7ed66794a9",
        "derivatives": [
          {
            "src": "assets/screenshots/uchiotose-f1e85d80c44b-960.webp",
            "sha256": "e356e4a0b73b1a9f8c45567b70b390a8a5ed366ef12fe67c336e503e80adc935"
          },
          {
            "src": "assets/screenshots/uchiotose-f1e85d80c44b-640.webp",
            "sha256": "dad5894b8ed5ad7ab6ae34b4b34fb004df88dd1c1e4abbb8e30b19081f644c4f"
          }
        ],
        "rightsBasis": [
          {
            "path": "docs/REQUIREMENTS.md",
            "url": "https://github.com/chameleonjp-lab/uchiotose/blob/2a7e815c70baf9dc65721fc938909b6ab083f074/docs/REQUIREMENTS.md"
          },
          {
            "path": "docs/IMPLEMENTATION_RELEASE.md",
            "url": "https://github.com/chameleonjp-lab/uchiotose/blob/2a7e815c70baf9dc65721fc938909b6ab083f074/docs/IMPLEMENTATION_RELEASE.md"
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
    "id": "senryou",
    "displayOrder": 6,
    "title": "センリョウ",
    "description": "戦闘機で地上戦へ介入し、歩兵による拠点占領を支援する一戦完結型ゲーム。実装候補の検証を進めており、公開入口は確認中です。",
    "releaseState": "unverified",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/senryou",
    "sourceCommit": "6ad011e951f5217abf65ad2e1291717b365b36ca",
    "sourceRoot": "https://github.com/chameleonjp-lab/senryou/tree/6ad011e951f5217abf65ad2e1291717b365b36ca",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/senryou/blob/6ad011e951f5217abf65ad2e1291717b365b36ca/README.md",
      "https://github.com/chameleonjp-lab/senryou/blob/6ad011e951f5217abf65ad2e1291717b365b36ca/docs/VERIFICATION.md"
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
        "https://github.com/chameleonjp-lab/senryou/blob/6ad011e951f5217abf65ad2e1291717b365b36ca/README.md",
        "https://github.com/chameleonjp-lab/senryou/blob/6ad011e951f5217abf65ad2e1291717b365b36ca/docs/VERIFICATION.md"
      ],
      "unknown": [
        "No official current play URL or deployed source commit could be established from the main README, documentation, HTML, JSON, workflows, or public branch/run records",
        "has_pages=true is observed repository configuration and does not establish a playable release"
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
  },
  {
    "id": "fantasia",
    "displayOrder": 7,
    "title": "ファンタジア",
    "description": "剣と魔法の世界で、7方面へ進む味方軍を戦闘機で支援する占領戦タイムアタック。実装候補の受入検証が残っており、公開に向けて準備中です。",
    "releaseState": "preparing",
    "playUrl": null,
    "repositoryUrl": "https://github.com/chameleonjp-lab/fantasia",
    "sourceCommit": "08f2c98582a627992e3c375ceb71f77cf0fbdc23",
    "sourceRoot": "https://github.com/chameleonjp-lab/fantasia/tree/08f2c98582a627992e3c375ceb71f77cf0fbdc23",
    "sourceObservedAt": "2026-10-09T14:46:27Z",
    "descriptionSources": [
      "https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/README.md",
      "https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/docs/RELEASE_GATE.json",
      "https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/docs/DELIVERY_STATUS.md"
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
        "https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/README.md",
        "https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/docs/RELEASE_GATE.json",
        "https://github.com/chameleonjp-lab/fantasia/blob/08f2c98582a627992e3c375ceb71f77cf0fbdc23/docs/DELIVERY_STATUS.md"
      ],
      "unknown": [
        "No official current play URL or deployed source commit could be established from the main README, documentation, HTML, JSON, workflows, or public branch/run records",
        "has_pages=true is observed repository configuration and does not establish a playable release",
        "Current checked-in docs/RELEASE_GATE.json has ready:false; README and delivery status explicitly leave publication acceptance incomplete"
      ],
      "evidenceFile": "docs/evidence/current-games.json",
      "deploymentRecord": null,
      "artifactHashes": {},
      "releaseGateReady": false
    },
    "thumbnail": null,
    "ranking": {
      "enabled": false,
      "displayState": "not_connected",
      "defaultMode": null,
      "modes": []
    },
    "contentUpdatedAt": "2026-10-09T14:58:37.293190+00:00"
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
