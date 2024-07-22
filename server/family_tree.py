# server/family_tree.py
import json
import openai
import os
from os.path import join, dirname, abspath
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# .envファイルの内容読み込み → その内容をopenaiのapikeyとして設定する
current_dir = dirname(abspath(__file__))
dotenv_path = join(current_dir, '.env')
load_dotenv(dotenv_path)
api_key = os.environ.get("API_KEY")
openai.api_key = api_key

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Reactアプリのオリジン→アスタリスク
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FamilyMember(BaseModel):
    id: int
    name: str
    relation: str
    age: int
    notes: str
    parents: Optional[List[int]] = []
    children: Optional[List[int]] = []
    contract: int
    sex: str

class FamilyTree(BaseModel):
    center: FamilyMember
    parents: List[FamilyMember]
    children: List[FamilyMember]

class FamilyTreeResponse(BaseModel):
    description: str
    family_tree: FamilyTree
    
# サンプルデータ（実際のアプリケーションではデータベースを使用することをお勧めします）
family_data = {
    1: FamilyMember(
        id=1,
        name="田中 太郎",
        relation="父",
        age=55,
        notes="仕事の話は避けてください",
        parents=[3, 4],
        children=[5, 6],
        contract = 1,
        sex = '男'
    ),
    2: FamilyMember(
        id=2,
        name="田中 花子",
        relation="母",
        age=49,
        notes="健康に気を使っています",
        parents=[7, 8],
        children=[5, 6],
        contract = 0,        
        sex = '女'

    ),
    5: FamilyMember(
    id=5,
    name="田中 次郎",
    relation="長男",
    age=20,
    notes="大学生です",
    parents=[1, 2],
    contract = 0,
    sex = '男'
),
    6: FamilyMember(
        id=6,
        name="田中 桃子",
        relation="長女",
        age=18,
        notes="受験生です",
        parents=[1, 2],
        contract = 2,
        sex = '女'
    ),
    7: FamilyMember(
        id=7,
        name="佐藤 健太",
        relation="祖父",
        age=72,
        notes="将棋が趣味です",
        children=[2],
        contract = 0,
        sex = '男'
    ),
    8: FamilyMember(
        id=8,
        name="佐藤 美智子",
        relation="祖母",
        age=69,
        notes="ガーデニングが好きです",
        children=[2],
        contract = 0,
        sex = '女'
    )
}

# 生命保険の営業提案文を生成
def generate_insurance_proposal(family_member: FamilyMember):
# ここはテストダミー
    dummy_proposal = f"""
    {family_member.name}様（{family_member.age}歳）への生命保険提案:

1.家族構成に基づいた保障の必要性:
田中様は家族4人の大黒柱です。配偶者と子供2人の生活を支える立場にあるため、万が一の際の家族の経済的保障が重要です。
特に子供たちが大学生年齢であることを考慮すると、教育費用の確保も必要です。
現在の養老保険に加えて、より充実した死亡保障を検討することをお勧めします。

2.年齢に応じた保険の種類:
50代前半の男性として、医療保険とがん保険の検討が適切です。この年齢層は生活習慣病やがんのリスクが高まる時期です。
特に、入院や手術に対する保障、三大疾病（がん、心筋梗塞、脳卒中）への備えを重視した保険プランを提案します。
また、介護保険の検討も将来に向けて有益でしょう。

3.特記事項を考慮した具体的なアドバイス:
田中様が自身の仕事の話を嫌うという点に配慮し、保険の説明では職業や仕事に関する話題を避けます。
代わりに、家族の幸せや将来の安心を中心に据えた会話を心がけましょう。
例えば、「ご家族の笑顔を守る」「お子様の未来をサポートする」といった表現を用いて、保険の必要性を伝えることが効果的です。

4.将来の家族の経済的安定を確保するための提案:
子供たちの独立後を見据えた長期的な経済計画を提案します。退職後の生活資金確保のため、変額年金保険や終身保険with特約などの貯蓄性の高い商品を検討しましょう。
また、配偶者の老後の生活を守るため、遺族年金特約付きの保険商品も有効です。さらに、子供たちの結婚資金や将来のサポートを考慮した積立型保険の提案も検討してください。
    """
    return dummy_proposal

# 入力プロンプト
    prompt = f"""
    {family_member.name}様（{family_member.age}歳）への生命保険提案:

    # 家族構成:
    - 子供: {len(family_member.children)}人
    - 親: {len(family_member.parents)}人

    # 特記事項: {family_member.notes}

    # 依頼事項
    上記の情報を基に、この方に適した生命保険の提案を行ってください。

    # 提案の条件
    提案には以下の4点を含めてください:
    1. 家族構成に基づいた保障の必要性
    2. 年齢に応じた保険の種類（例：医療保険、がん保険など）
    3. 特記事項を考慮した具体的なアドバイス
    4. 将来の家族の経済的安定を確保するための提案

    # 提案文章の書き方
    1. 1,2,3,4それぞれについて約50単語でまとめること
    2. 提案は簡潔かつ具体的に、約400単語でまとめること
    3. 1,2,3,4それぞれの点で箇条書きにし、改行(\n)を入れること
    """

# ここから下は本番。デモ時はコメントアウトする
#    try:
#        response = openai.chat.completions.create(
#            model="gpt-4-turbo",
#            messages=[
#                {"role": "system", "content": "あなたは経験豊富な生命保険のコンサルタントです。顧客の状況に応じた適切な保険提案を行います。"},
#                {"role": "user", "content": prompt}
#            ],
#            max_tokens=700
#        )
#        return response.choices[0].message.content.strip()
#    except Exception as e:
#        print(f"Error generating proposal: {e}")
#        return "提案の生成中にエラーが発生しました。"


# 提案文を生成してプリントする関数
def print_insurance_proposal(member_id: int):
    if member_id not in family_data:
        print(f"Error: Member with ID {member_id} not found")
        return
    
    member = family_data[member_id]
    proposal = generate_insurance_proposal(member)
    print(f"Proposal for {member.name}:")
    print(proposal)
    print("\n" + "="*50 + "\n")  # 提案の区切り線

@app.get("/server/family-tree", response_model=FamilyTreeResponse)
@app.get("/server/family-tree/{member_id}", response_model=FamilyTreeResponse)
async def get_family_tree(member_id: int = 1):
    if member_id not in family_data:
        raise HTTPException(status_code=404, detail="Member not found")

    center = family_data[member_id]
    parents = [family_data[p] for p in center.parents if p in family_data]
    children = [family_data[c] for c in center.children if c in family_data]

    family_tree = FamilyTree(
        center=center,
        parents=parents,
        children=children
    )

    description = generate_insurance_proposal(center)

    response = FamilyTreeResponse(
        description=description,
        family_tree=family_tree
    )
    print("API Response:", response.dict())
    return response

# family_tree.py の最後に以下を追加
@app.get("/")
async def root():
    return {"message": "Family Tree API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
