# server/family_tree.py
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
        age=45,
        notes="仕事の話は避けてください",
        parents=[3, 4],
        children=[5, 6]
    ),
    2: FamilyMember(
        id=2,
        name="田中 花子",
        relation="母",
        age=43,
        notes="健康に気を使っています",
        parents=[7, 8],
        children=[5, 6]
    ),
    3: FamilyMember(
        id=3,
        name="田中 一郎",
        relation="祖父",
        age=70,
        notes="耳が遠いです",
        children=[1]
    ),
    4: FamilyMember(
        id=4,
        name="田中 みどり",
        relation="祖母",
        age=68,
        notes="料理が得意です",
        children=[1]
    ),
    5: FamilyMember(
        id=5,
        name="田中 次郎",
        relation="長男",
        age=20,
        notes="大学生です",
        parents=[1, 2]
    ),
    6: FamilyMember(
        id=6,
        name="田中 桃子",
        relation="長女",
        age=18,
        notes="受験生です",
        parents=[1, 2]
    ),
    7: FamilyMember(
        id=7,
        name="佐藤 健太",
        relation="祖父",
        age=72,
        notes="将棋が趣味です",
        children=[2]
    ),
    8: FamilyMember(
        id=8,
        name="佐藤 美智子",
        relation="祖母",
        age=69,
        notes="ガーデニングが好きです",
        children=[2]
    )
}

# 生命保険の営業提案文を生成する関数
def generate_insurance_proposal(family_member: FamilyMember):
    # これはテスト用
    return f"""
    {family_member.name}様への生命保険提案:

    1. 家族構成に基づいた保障:
       {family_member.name}様は{len(family_member.children)}人のお子様がいらっしゃいますので、家族収入保険をおすすめします。

    2. 年齢に応じた保険:
       {family_member.age}歳ということで、医療保険とがん保険も検討されてはいかがでしょうか。

    3. 特記事項を考慮したアドバイス:
       {family_member.notes}ということですので、{family_member.name}様の生活スタイルに合わせた保障を提案いたします。

    4. 将来の経済的安定:
       老後の備えとして、終身保険や個人年金保険も併せてご検討ください。

    具体的な保険プランについては、{family_member.name}様の詳細なニーズをお伺いした上で、最適なプランをご提案させていただきます。
    """

# 実行時はコメントアウト外す
#    prompt = f"""
#    {family_member.name}様（{family_member.age}歳）への生命保険提案:

#    家族構成:
#    - 子供: {len(family_member.children)}人
#    - 親: {len(family_member.parents)}人

#    特記事項: {family_member.notes}

#    上記の情報を基に、この方に適した生命保険の提案を行ってください。
#    提案には以下の点を含めてください：
#    1. 家族構成に基づいた保障の必要性
#    2. 年齢に応じた保険の種類（例：医療保険、がん保険など）
#    3. 特記事項を考慮した具体的なアドバイス
#    4. 将来の家族の経済的安定を確保するための提案

#    提案は簡潔かつ具体的に、約200-300単語でまとめてください。


    # 実行時はコメントアウトを外す
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "あなたは経験豊富な生命保険のコンサルタントです。顧客の状況に応じた適切な保険提案を行います。"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating proposal: {e}")
        return "提案の生成中にエラーが発生しました。"
    """
"""
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
"""
"""
@app.get("/server/family-tree")
@app.get("/server/family-tree/{member_id}")
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

    return family_tree
"""
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
