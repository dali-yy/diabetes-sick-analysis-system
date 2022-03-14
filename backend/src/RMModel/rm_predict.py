import sys
import os

import json

import joblib
import pandas as pd
import numpy as np
from pandas.core.indexes import base

WORK_PATH = "./src/RMModel/"


def file_predict(filename: str):
    """
    数据文件预测
    """
    # 打开文件
    data_balance = pd.read_csv(filename)
    # 将数据转换成模型输入的格式
    X = data_balance.loc[:, 'race':'diabetesMed']
    x = np.array(X)
    # 加载模型
    rfc = joblib.load(WORK_PATH + "rfc.pkl")
    # 使用训练后的模型预测再入院概率
    all_proba = rfc.predict_proba(X)
    # 将预测的概率写入文件
    data_balance["proba"] = ""
    for idx in data_balance.index:
        data_balance.loc[idx, 'proba'] = all_proba[idx][1]

    # 获取上传文件的名称
    basename = os.path.splitext(os.path.basename(filename))[0]
    # 预测后的结果文件存放路径
    save_path = "./result/" + basename + "_pred.csv"
    # 保存预测结果文件
    data_balance.to_csv(save_path, index=None)

    return save_path

def sta_result(filename: str): 
    """
    统计再入院预测结果
    """
    df = pd.read_csv(filename)

    # 统计结果存入json文件中
    with open(WORK_PATH + "result.json", mode='w', encoding='utf8') as f:
        json.dump({"nonReadMitted": len(df[df["proba"]<0.5]), "readMitted": len(df[df["proba"]>=0.5])}, f)

    return len(df[df["proba"]<0.5]), len(df[df["proba"]>=0.5])

if __name__ == "__main__":
    result_path = file_predict(sys.argv[1])
    # 输出统计结果到控制台
    x1, x2 = sta_result(result_path)
    print(x1, x2, sep=" ", end="")