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
    sex: str

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
    Person(name="田中桃子", age=18, relation="長女", note="受験生です", description="18歳女性", contract = 2,sex = "女"),
    Person(name="田中太郎", age=55, relation="父", note="仕事の話は避けてください", description="45歳男性", contract = 1, sex="男"),
    Person(name="田中次郎", age=20, relation="長男", note="大学生です。学生結婚しました", description="20歳男性", contract = 0, sex="男"),
]

def generate_insurance_proposal(family_members: List[Person]) -> str:
    if TEST_MODE:
        # テストモード時のダミー提案文
        center = next((person for person in family_members if person.relation == "父"), family_members[0])
        return f"""
        {center.name}様（{center.age}歳）への新提案

        1. 家族構成に基づいた保障の必要性:
        田中様の責任は、核家族だけでなく高齢の両親にも及びます。両親の介護や医療費用の可能性を考慮し、介護保険や医療保険の拡充が必要です。
        また、兄弟姉妹との協力体制を考慮しつつ、自身の家族と両親の双方をカバーする保障設計が重要です。
        特に、両親の住まいが隣県であることから、将来的な介護や緊急時の対応も視野に入れる必要があります。
        
        2. 年齢に応じた保険の種類:
        田中様ご自身と配偶者には、先の提案通り医療保険とがん保険が適切です。加えて、72歳の両親には介護保険と高齢者向け医療保険の検討が急務です。
        52歳の兄と46歳の妹にも、三大疾病保障を含む医療保険の必要性を伝えることが重要です。家族全体の健康と経済的安定を守るため、各世代に適した保険プランを提案しましょう。

        3. 特記事項を考慮した具体的なアドバイス:
        田中様が自身の仕事の話を嫌う点は変わりませんが、家族の健康と将来に焦点を当てた会話を心がけます。特に、両親の足が弱いという点に注目し、将来の介護需要を見据えた提案が効果的です。
        例えば、「ご両親の安心な老後を支える」「家族全員の健康を守る」といった表現を用いて、拡大家族全体の保障の必要性を伝えましょう。
        兄が多忙であることを考慮し、家族の保障における田中様の役割の重要性も強調できます。

        4. 将来の家族の経済的安定を確保するための提案:
        拡大家族全体の経済的安定を図るため、より包括的な提案が必要です。田中様自身の老後資金に加え、両親の介護費用や医療費の準備を含めた資金計画を立てましょう。
        例えば、介護年金保険や終身医療保険など、長期的な保障を提供する商品を検討します。
        また、兄弟姉妹との協力体制を考慮し、家族間での費用分担を想定した柔軟な保険設計も重要です。さらに、子供たちの将来支援と両親の介護に備えたバランスの取れた資金計画を提案しましょう。
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