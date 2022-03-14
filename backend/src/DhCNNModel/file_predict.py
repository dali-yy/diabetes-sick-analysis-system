# -*- coding: utf-8 -*-
# @Time : 2021/11/4 9:14
# @Author : XXX
# @Site : 
# @File : file_predict.py
# @Software: PyCharm
import sys

import pandas as pd
import torch
import torch.nn.functional as F
from tqdm import tqdm

from model import TextCNN
import configure as config
from utils import seq_to_vec_, load_vocab, generate_text
import os
import json

# 加载语料库
vocab = load_vocab(config.vocab_path)

# 加载预测模型
model = torch.load(config.model_path)
model.eval()


def predict(sequence):
    """
    根据症状描述预测患糖尿病概率
    :param sequence: 症状描述
    :return: 患糖尿病的概率
    """
    vec = seq_to_vec_(sequence, vocab)  # 将序列映射成向量
    X = torch.LongTensor(vec).view(-1, 1)  # 转化成指定输入格式
    target = model(X)
    pred = F.softmax(target.view(-1), dim=0)  # 使用softmax函数得到概率
    return pred[1].item()


def file_predict(file_path):
    """
    文件预测
    :param file_path:文件路径
    :return:
    """
    # 获取文件名和后缀名
    file_name, suffix = os.path.splitext(file_path)
    # 根据文件类型读取文件
    if suffix == ".csv":
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
    # 添加两列记录预测结果
    df["proba"] = ""
    # 遍历每条数据
    for idx in tqdm(df.index):
        content = df.loc[idx, "content"]
        age = df.loc[idx, "年龄"]
        sex = df.loc[idx, "性别"]
        indicators = df.loc[idx, "糖化血红蛋白": "高密度脂蛋白"]
        # 多模态数据融合
        sequence = generate_text(content, age, sex, indicators)
        # 预测患病概率
        proba = predict(sequence)
        # 记录患病概率
        df.loc[idx, "proba"] = proba
    return df


def summary_result(result_df):
    """
    汇总结果
    :param result_df:预测结果
    :return:
    """
    proba_distribution = {}  # 患病概率分布
    age_distribution = {}  # 患者年龄分布
    sex_distribution = {}  # 患者性别分布

    age_group = {"婴幼儿": 6, "少儿": 12, "青少年": 17, "青年": 45, "中年": 69, "老年": 1e7}
    proba_group = {"0~25%": 0.25, "25%~50%": 0.5, "50%~75%": 0.75, "75%~100%": 1}

    # 概率大于0.5则被视为患有糖尿病
    ill_df = result_df[result_df["proba"] > 0.5]

    # 统计患者性别分布
    sex_distribution["男"] = len(ill_df[ill_df["性别"] == 1])
    sex_distribution["女"] = len(ill_df[ill_df["性别"] == 0])

    # 统计患者年龄分布
    age_temp = 0
    for key, value in age_group.items():
        age_distribution[key] = len(ill_df[ill_df["年龄"] < value]) - age_temp
        age_temp = age_distribution[key]

    # 统计患病概率分布
    proba_temp = 0
    proba_group = {"0~25%": 0.25, "25%~50%": 0.5, "50%~75%": 0.75, "75%~100%": 1}
    for key, value in proba_group.items():
        proba_distribution[key] = len(result_df[result_df["proba"] < value]) - proba_temp
        proba_temp = proba_distribution[key]
    return {"proba": proba_distribution, "age": age_distribution, "sex" :sex_distribution}


if __name__ == "__main__":
    filename = sys.argv[1]
    basename = os.path.splitext(os.path.basename(filename))[0]
    # 开始预测
    result_df = file_predict(filename)
    # 保存预测结果到文件
    result_df.to_csv("./result/" + basename + "_pred.csv", index=None)

    # 统计预测结果
    result = summary_result(result_df)
    # 保存统计结果到文件
    with open(config.work_path + "result.json", mode="w", encoding="utf8") as f:
        json.dump(result, f)

