from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
import logging
import openai
import os
import json
import traceback
from os.path import join, dirname, abspath
from dotenv import load_dotenv

# ログ取得用の設定
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# .envファイルの内容読み込み
current_dir = dirname(abspath(__file__))
dotenv_path = join(current_dir, '.env')
load_dotenv(dotenv_path)
api_key = os.environ.get("API_KEY")
openai.api_key = api_key

# テストモードの設定
TEST_MODE = os.getenv('TEST_MODE', 'False').lower() == 'true'

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # オープンポート。Reactアプリのオリジンに書換
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Person(BaseModel):
    name: str
    age: int
    relation: str
    note: Optional[str] = None
    description: Optional[str] = None
    contract: int = 0

class FamilyTreeWithProposal(BaseModel):
    center: Person
    family_members: List[Person]
    insurance_proposal: str = "保険提案が生成されませんでした"

    class Config:
        json_encoders = {
            Person: lambda v: v.dict()
        }

# 既存の家族メンバー(辞書形式)
existing_family_members = [
    Person(name="田中太郎", age=55, relation="父", note="仕事の話は避けてください", description="45歳男性", contract = 1),
    Person(name="田中桃子", age=18, relation="長女", note="受験生です", description="18歳女性", contract = 2),
    Person(name="田中次郎", age=20, relation="長男", note="大学生です。学生結婚しました", description="20歳男性", contract = 0),
]

def generate_insurance_proposal(family_members: List[Person]) -> str:
    if TEST_MODE:
        # テストモード時のダミー提案文
        return """
        テストコード：これはダミーの保険提案です。
        実際の運用時には、ここに詳細な保険提案が生成されます。
        1. 家族構成に基づいた保障の必要性:
        ご家族の状況を考慮すると、万が一の際の生活保障が重要です。ご家族の将来の安定のため、死亡保障と医療保障のバランスの取れた保険設計をお勧めします。

        2. 年齢に応じた保険の種類:
        現在のお年齢を考慮すると、終身保険と医療保険の組み合わせが適切です。特に、重大疾病保障特約付きの保険製品をお勧めします。

        3. 特記事項を考慮した具体的なアドバイス:
        ご家族の特記事項を踏まえ、教育資金の準備も視野に入れた貯蓄性のある保険商品も検討が必要です。また、介護保険の早期加入もご検討ください。

        4. 将来の家族の経済的安定を確保するための提案:
        ライフステージの変化に応じて保障を見直せる変額保険や、年金型の保険商品も選択肢として考慮してください。将来の経済的な不安を軽減し、ご家族の生活を守るための総合的な保障プランをご提案いたします。
        """
    else:
        try:
            center = next((person for person in family_members if person.relation == "長男"), family_members[0])
            
            prompt = f"""
            {center.name}様（{center.age}歳）への生命保険提案:

            # 家族構成:
            {', '.join([f"{member.relation}: {member.name}（{member.age}歳）" for member in family_members if member.name != center.name])}

            # 特記事項: {center.note}

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
            """

            response = openai.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "あなたは経験豊富な生命保険のコンサルタントです。顧客の状況に応じた適切な保険提案を行います。"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=700
            )
            proposal = response.choices[0].message.content.strip()
            logger.debug(f"Generated proposal: {proposal}")
            return proposal
        except Exception as e:
            logger.error(f"Error generating proposal: {e}")
            logger.error(traceback.format_exc())  # スタックトレースを出力
            return "提案文の生成中にエラーが発生しました。"


@app.post("/generate_family_tree")
async def generate_family_tree(selected_members: List[Person]):
    try:
        logger.debug(f"Received selected members: {selected_members}")
        
        all_family_members = existing_family_members.copy()
        for member in selected_members:
            if not any(existing.name == member.name for existing in all_family_members):
                all_family_members.append(member)
        
        logger.debug(f"All family members: {all_family_members}")

        center = next((person for person in all_family_members if person.relation == "長男"), all_family_members[0])
        
        logger.debug(f"Center person: {center}")

        insurance_proposal = generate_insurance_proposal(all_family_members)
        logger.debug(f"Generated insurance proposal: {insurance_proposal}")

        result = FamilyTreeWithProposal(center=center, family_members=all_family_members, insurance_proposal=insurance_proposal)
        logger.debug(f"Returning result: {result}")

        # レスポンスの内容を詳細にログ出力
        response_dict = result.dict()
        logger.debug(f"Response content(dict): {json.dumps(response_dict, indent=2, ensure_ascii=False)}")

        # JSONシリアライズを試みる
        try:
            json_response = jsonable_encoder(result)
            logger.debug(f"JSON serialized response: {json.dumps(json_response, indent=2, ensure_ascii=False)}")
        except Exception as json_error:
            logger.error(f"Error serializing response to JSON:{str(json_error)}")

        return result
    
    except Exception as e:
        logger.error(f"Error in generate_family_tree: {str(e)}")
        logger.error(traceback.format_exc())  # スタックトレースを出力
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/update_family_tree")
async def update_family_tree(new_center_name: str, all_members: List[Person]):
    try:
        new_center = next((person for person in all_members if person.name == new_center_name), None)
        if not new_center:
            raise HTTPException(status_code=404, detail="New center person not found")
        
        insurance_proposal = generate_insurance_proposal(all_members)
        
        result = FamilyTreeWithProposal(center=new_center, family_members=all_members, insurance_proposal=insurance_proposal)
        logger.debug(f"Returning updated result: {result}")

        return result
    except Exception as e:
        logger.error(f"Error in update_family_tree: {str(e)}")
        logger.error(traceback.format_exc())  # スタックトレースを出力
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# 起動確認用(直接URLを打ち込むとメッセージを表示する)
@app.get("/")
async def root():
    return {"message": "Welcome to the Family Tree API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8040)