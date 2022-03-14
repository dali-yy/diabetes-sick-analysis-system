# -*- coding: utf-8 -*-
# @Time : 2021/11/13 15:17
# @Author : XXX
# @Site : 
# @File : one_predict.py
# @Software: PyCharm
import sys

import joblib
import json
import numpy as np

WORK_PATH = "./src/RMModel/"

def convert_json_to_input(jsonfile: str):
    """
    将json文件转化成模型输入格式
    :param jsonfile:
    :return:
    """
    # 将json文件转换成json对象
    with open(jsonfile, mode="r", encoding="utf8") as f:
        data = json.load(f)
    # 转换成模型输入的格式
    X = np.array([int(value) for value in data.values()]).reshape(1, -1)
    return X


def predict(features):
    # 加载模型
    rfc = joblib.load(WORK_PATH + "rfc.pkl")
    # 使用训练后的模型预测再入院概率
    proba = rfc.predict_proba(features)
    # 返回概率
    return proba[0][1]


if __name__ == "__main__":
    X = convert_json_to_input(sys.argv[1])
    proba = predict(X)
    print(proba, end="")
