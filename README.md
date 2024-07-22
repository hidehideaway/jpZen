# 使い方
## 事前準備
* Node.jsインストール
下記URLよりインストールする。（齋藤さんの立てたEC2にはインストール済みなので、ローカルPCで実施すればOK）
```
https://nodejs.org/en/
```

* VSCodeなどのエディターを使っている場合は再起動

* zen-mockフォルダ上にいることを確認し下記コマンドでパッケージをインストール  
```
npm install
```

* インストール成功後下記コマンドでプログラム起動
```
npm start
```

## ソースコード説明
### プログラム構成
* 本プログラムはReact.jsをベースにしている。  
プログラム構成は下記のとおり。（重要なファイルのみ記載）
```
.
├─── src
  └─ App.js             // npm start実行後最初に呼ばれるファイル。ルーティング設定を記述している。パスを追加したい際には、既に書いてある内容を参考に追加する。
  └─ routes             // App.jsのルーティングにより呼ばれる画面ごとのモジュール
    └─ consultant.js      : ログイン画面
    └─ client_list.js     : 訪問リスト一覧画面
    └─ contract.js        : 契約詳細表示画面
    └─ family_tree.js     : 家族構成図(既存)表示画面
    └─ route_guide.js     : 訪問ルート表示画面
    └─ register.js        : 関係者候補リスト一覧表示画面
    └─ new_family.js      : 家族構成図(更新後)表示画面
├─── public 
  └─ 01_consltant     : src/routes/consultant.jsにより下記のhtmlが呼ばれる
    └─ index.html
    └─ script.js
  └─ 02_client_list   : src/routes/client_list.jsにより下記のhtmlが呼ばれる
    └─ index.html
    └─ script.js
  └─ 03_contract      : src/routes/contract.jsにより下記のhtmlが呼ばれる
    └─ index.html
    └─ script.js
  └─ 04_faimly_tree   : src/routes/family_tree.jsにより下記のhtmlが呼ばれる
    └─ index.html
    └─ script.js
  └─ 05_route_guide   : src/routes/route_guide.jsにより下記のhtmlが呼ばれる
    └─ index.html
    └─ script.js
  └─ 06_register      : src/routes/register.jsにより下記のhtmlが呼ばれる
    └─ index.html
    └─ script.js
  └─ 07_new_family    : src/routes/new_family.jsにより下記のhtmlが呼ばれる
    └─ index.html
    └─ script.js
```
