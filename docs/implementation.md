# 実装計画書

## 1. 主要な決定事項と仕様（確認済み）
議論に基づき、以下の仕様を決定しました。

1.  **IPアドレスの扱い**:
    *   ヘッダー（例：`x-forwarded-for`）を使用してIPを検出します。
    *   ローカル開発環境では、モックIPまたは `127.0.0.1` にフォールバックします。
2.  **セッション管理**:
    *   ログイン時に `nickname` と `role` を保存するために、HTTP-only Cookieを使用したシンプルなセッションを実装します。
    *   セキュリティ確保のため、IPアドレスを現在のリクエストのIPと検証します。
3.  **リアルタイム更新（投票/ギャラリー）**:
    *   **ポーリング**（5秒ごと）を使用して最新データを取得します。
    *   WebSocketの実装は不要です。
4.  **投票フロー**:
    *   **インタラクティブ**: ハートアイコンの切り替えは、ローカルのUI状態を即座に更新します（楽観的UI）。
    *   **保存**: 投票は、TAが **「送信（Submit）」ボタンをクリックしたときのみ** データベースにコミットされます。
    *   **可視性**: 他のTAは、投票がDBに送信された後にのみ（ポーリングを通じて）更新された投票数を見ることができます。

---

## 2. 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: ShadCN UI
- **環境**: Node.js

## 3. データベーススキーマ設計 (Prisma)

### モデル
1.  **User**
    *   `ipAddress` (String, ID, Unique) - 主キー。
    *   `nickname` (String)
    *   `role` (Enum: STUDENT, TA, ADMIN)
    *   `createdAt` (DateTime)
    *   `lastLoginAt` (DateTime)

2.  **Submission**
    *   `id` (Int/String, ID) - UUID または 自動増分。
    *   `url` (String)
    *   `userId` (String) - User.ipAddress への外部キー。
    *   `createdAt` (DateTime)
    *   `updatedAt` (DateTime)

3.  **Vote**
    *   `id` (Int/String, ID)
    *   `submissionId` (Int/String) - Submission.id への外部キー。
    *   `voterIp` (String) - User.ipAddress への外部キー（投票したTA）。
    *   `createdAt` (DateTime)
    *   *ユニーク制約 [submissionId, voterIp]*：1つの提出物への二重投票を防止。

## 4. 環境変数 (`.env.local`)
- `DATABASE_URL`: PostgreSQL接続文字列。
- `ADMIN_CODE`: 管理者を識別するコード（例: `1234`）。
- `REQUIRED_TEXT`: URLの検証用テキスト（例: `code.org`）。
- `SESSION_SECRET`: Cookie署名用（`iron-session`等のライブラリを使用する場合）。

## 5. 実装ステップ

### フェーズ 1: セットアップとインフラ
1.  Next.js 15 プロジェクトの初期化。
2.  Tailwind CSS と ShadCN UI のセットアップ。
3.  Prisma と PostgreSQL の設定。
4.  ダミー値を含む `.env.local` の作成。

### フェーズ 2: バックエンドとデータベース
1.  Prismaスキーマの定義。
2.  マイグレーションの実行（`npx prisma migrate dev`）。
3.  サービス層（Server Actions/Utils）の作成:
    *   `loginUser(nickname, ip)`: ユーザーのUpsert、ロール判定。
    *   `upsertSubmission(url, ip)`: 学生の提出処理。
    *   `saveVotes(votes, voterIp)`: TAの投票を一括保存するトランザクション。
    *   `resetVotes()`: Voteテーブルをクリアする管理者機能。

### フェーズ 3: 認証とミドルウェア
1.  **ログインページ (`/login`)**:
    *   ニックネーム入力フォーム。
    *   Server Actionで `?TA`, `?[ADMIN_CODE]` サフィックスをチェック。
    *   HTTP-only Cookieを設定。
2.  **ミドルウェア**:
    *   保護されたルートでセッションCookieをチェック。
    *   ない場合は `/login` にリダイレクト。
    *   （任意）ロールベースのアクセス制御ロジック。

### フェーズ 4: 機能実装

#### A. 学生 - 提出ページ (`/`)
-   **ロジック**: ユーザーが STUDENT であるか確認。
-   **UI**:
    -   URL入力フィールド。
    -   バリデーション: `REQUIRED_TEXT` を含む必要がある。
    -   提出済みの場合は「提出済み: [URL]」を表示。

#### B. TA - 投票ページ (`/voting`)
-   **ロジック**: ユーザーが TA であるか確認。
-   **データ取得**: 全提出物と現在の投票数、「自分が投票したか」の状態を取得。
-   **UI**:
    -   カードのグリッド表示（ニックネーム、URL、ハート）。
    -   **ローカル状態**: 選択されたハートを追跡。最大5つ。
    -   **ポーリング**: `useInterval` 等で5秒ごとに投票数を再取得。
    -   **アクション**: 「送信」ボタンで `saveVotes` を呼び出し。

#### C. 管理者 - ダッシュボード (`/admin`)
-   **ロジック**: ユーザーが ADMIN であるか確認。
-   **UI**:
    -   ユーザー一覧テーブル（ニックネーム、ロール、IP、提出済みか）。
    -   「投票リセット」ボタン -> 確認ダイアログ -> `resetVotes` 呼び出し。

#### D. ギャラリーページ (`/gallery`)
-   **ロジック**: パブリックまたは認証済み（要件では共有ビューを示唆）。
-   **UI**:
    -   投票数（またはニックネーム）順にソートされた読み取り専用カード。
    -   **自動更新**: 5秒ごとのポーリング。

### フェーズ 5: UI/UX 調整
1.  ダークテーマの適用（Tailwind設定）。
2.  ヘッダーコンポーネントの実装:
    -   アプリタイトル。
    -   整形されたニックネーム（`?TA` 等を除去）。
    -   ナビゲーションリンク。

## 6. フォルダ構成
```
src/
  app/
    (auth)/login/page.tsx
    (dashboard)/page.tsx      # ロールベースのリダイレクトまたは条件付きレンダリング
    (dashboard)/layout.tsx    # 共通ヘッダー
    (dashboard)/voting/page.tsx
    (dashboard)/admin/page.tsx
    gallery/page.tsx
    api/                      # ポーリング用エンドポイント（Server Actionsを使用しない場合）
  components/
    ui/                       # ShadCNコンポーネント
    feature/                  # VotingCard, SubmissionForm, UserTable
  lib/
    prisma.ts
    utils.ts
    actions.ts                # DB操作用 Server Actions
    hooks/                    # usePolling など
```
