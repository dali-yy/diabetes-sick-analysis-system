# -*- coding: utf-8 -*-
# @Time : 2021/11/14 19:53
# @Author : XXX
# @Site : 
# @File : auto_test.py
# @Software: PyCharm
import sys

from sklearn.model_selection import train_test_split
from tensorflow.keras.models import load_model
from sklearn.metrics import roc_curve, auc, precision_recall_curve
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from numpy.random import seed

WORK_PATH = "./src/ADModel/"


def read_file(filename):
    """
    读取文件
    :param filename: 文件名
    :return:
    """
    df = pd.read_csv(filename)  # 读取文件

    # 提取负样本(正常数据；label:0),并且按照8:2的比例切分成训练集合测试集。
    mask = (df['Class'] == 0)
    X_train, X_test = train_test_split(df[mask], test_size=0.2, random_state=920)
    X_train = X_train.drop(['Class'], axis=1).values
    X_test = X_test.drop(['Class'], axis=1).values

    # 提取所有正样本(异常数据，label：1)，作为测试集的一部分
    X_anomaly = df[~mask].drop(['Class'], axis=1).values

    return X_train, X_test, X_anomaly


def main(dataname):
    seed(1)
    X_train, X_test, X_fraud = read_file(dataname)
    # 读取模型
    autoencoder = load_model(WORK_PATH + 'ad_model.h5')

    # 利用训练好的autoencoder重建测试集(X_test;X_fraud  前者是正常样本，后者是所有的异常样本)
    pred_test = autoencoder.predict(X_test)
    pred_fraud = autoencoder.predict(X_fraud)

    # 计算还原误差MSE和MAE ；前者是loss；后者是metrics的mae
    mse_test = np.mean(np.power(X_test - pred_test, 2), axis=1)
    mse_fraud = np.mean(np.power(X_fraud - pred_fraud, 2), axis=1)

    mae_test = np.mean(np.abs(X_test - pred_test), axis=1)
    mae_fraud = np.mean(np.abs(X_fraud - pred_fraud), axis=1)
    mse_df = pd.DataFrame()
    mse_df['Class'] = [0] * len(mse_test) + [1] * len(mse_fraud)
    mse_df['MSE'] = np.hstack([mse_test, mse_fraud])
    mse_df['MAE'] = np.hstack([mae_test, mae_fraud])
    mse_df = mse_df.sample(frac=1).reset_index(drop=True)

    """
     sample（）参数frac是要返回的比例，比如df中有10行数据，我只想返回其中的30%,那么frac=0.3
     set_index()和reset_oindex()的区别 前者为现有的dataframe设置不同于之前的index;而后者是还原和最初的index方式：0,1,2,3,4……
    """

    # 分别画出测试集中正样本和负样本的还原误差MAE和MSE
    markers = ['o', '^']
    colors = ['dodgerblue', 'coral']
    labels = ['Non-Anomaly', 'Anomaly']

    plt.figure(figsize=(12, 5))
    plt.subplot(121)
    for flag in [1, 0]:
        temp = mse_df[mse_df['Class'] == flag]
        plt.scatter(temp.index,
                    temp['MAE'],
                    alpha=0.7,
                    marker=markers[flag],
                    c=colors[flag],
                    label=labels[flag])
    plt.title('Reconstruction MAE')
    plt.ylabel('Reconstruction MAE')
    plt.xlabel('Index')
    plt.subplot(122)

    for flag in [1, 0]:
        temp = mse_df[mse_df['Class'] == flag]
        plt.scatter(temp.index,
                    temp['MSE'],
                    alpha=0.7,
                    marker=markers[flag],
                    c=colors[flag],
                    label=labels[flag])
    plt.legend(loc=[1, 0], fontsize=10)
    plt.title('Reconstruction MSE')
    plt.ylabel('Reconstruction MSE')
    plt.xlabel('Index')
    plt.savefig(WORK_PATH + "fig1.png")
    # plt.show()

    # 画出Precision-Recall曲线
    plt.figure(figsize=(12, 6))
    for i, metric in enumerate(['MAE', 'MSE']):
        plt.subplot(1, 2, i + 1)
        precision, recall, _ = precision_recall_curve(mse_df['Class'], mse_df[metric])
        pr_auc = auc(recall, precision)
        plt.title('Precision-Recall curve based on %s\nAUC = %0.2f' % (metric, pr_auc))
        plt.plot(recall[:-2], precision[:-2], c='coral', lw=4)
        plt.xlabel('Recall')
        plt.ylabel('Precision')
    # plt.show()
    plt.savefig(WORK_PATH + "fig2.png")

    #  画出ROC曲线
    plt.figure(figsize=(12, 6))
    for i, metric in enumerate(['MAE', 'MSE']):
        plt.subplot(1, 2, i + 1)
        fpr, tpr, _ = roc_curve(mse_df['Class'], mse_df[metric])
        roc_auc = auc(fpr, tpr)
        plt.title('Receiver Operating Characteristic based on %s\nAUC = %0.2f' % (metric, roc_auc))
        plt.plot(fpr, tpr, c='coral', lw=4)
        plt.plot([0, 1], [0, 1], c='dodgerblue', ls='--')
        plt.ylabel('TPR')
        plt.xlabel('FPR')
    # plt.show()
    plt.savefig(WORK_PATH + "fig3.png")

    # 画出MSE、MAE散点图
    markers = ['o', '^']
    colors = ['dodgerblue', 'coral']
    labels = ['Non-Anomaly', 'Anomaly']

    plt.figure(figsize=(10, 5))
    for flag in [1, 0]:
        temp = mse_df[mse_df['Class'] == flag]
        plt.scatter(temp['MAE'],
                    temp['MSE'],
                    alpha=0.7,
                    marker=markers[flag],
                    c=colors[flag],
                    label=labels[flag])
    plt.legend(loc=[1, 0])
    plt.ylabel('Reconstruction RMSE')
    plt.xlabel('Reconstruction MAE')
    # plt.show()
    plt.savefig(WORK_PATH + "fig4.png")


if __name__ == "__main__":
    main(sys.argv[1])
