import sys
import json
import jieba
import configure as config


def stopwords_list(filepath):
    """
    # 获取停用词列表
    :param filepath:
    :return:
    """
    stopwords = [line.strip() for line in open(filepath, 'rb').readlines()]
    return stopwords


def cut(sentence):
    """
    分词处理
    :param sentence:
    :return:
    """
    stopwords = stopwords_list(config.stop_path)  # 停用词列表
    return [token for token in jieba.lcut(sentence) if token not in stopwords]


def load_vocab(path):
    """
    加载语料库文件
    :param path: 语料库文件地址
    :return: 语料库字典
    """
    print(path)
    with open(path, encoding="utf-8") as f:
        vocab = json.load(f)
    return vocab


def seq_to_vec(sequence, path):
    """
    根据已有的语料库将序列映射成向量
    :param sequence:
    :param path: 语料库文件地址
    :return:
    """
    vector = []
    vocab = load_vocab(path)
    words = cut(sequence)
    for word in words:
        if word in vocab.keys():
            vector.append(vocab[word])
        else:
            vector.append(vocab["<unk>"])  # 该词未在语料库中出现
    #  保证转换后的向量维度不小于5
    if len(vector) < 5:
        for i in range(len(vector), 5):
            vector.append(vocab['<pad>'])
    return vector

def seq_to_vec_(sequence, vocab):
    """
    根据已有的语料库将序列映射成向量
    :param sequence:
    :param path: 语料库文件地址
    :return:
    """
    vector = []
    words = cut(sequence)
    for word in words:
        if word in vocab.keys():
            vector.append(vocab[word])
        else:
            vector.append(vocab["<unk>"])
    return vector

def generate_text(content, age, sex, indicators):
    """
    根据症状描述和体检数据生成待预测的文本
    :param content: 症状描述
    :param age: 年龄
    :param sex: 性别
    :param indicators:体检指标
    :return: 待预测的文本
    """
    # 年龄段
    age_group = {"婴幼儿": 6, "少儿": 12, "青少年": 17, "青年": 45, "中年": 69, "老年": 1e7}
    # 体检指标阈值
    metrics = {"糖化血红蛋白": [0.04, 0.06],
               "γ-谷氨酰转肽酶": [10, 60],
               "乳酸脱氢酶": [120, 220],
               "低密度脂蛋白": [0.00, 3.37],
               "前白蛋白": [0.20, 0.40],
               "尿素": [2.0, 7.1],
               "尿酸": [208, 428],
               "总胆固醇": [2.86, 6.10],
               "总胆汁酸": [0.0, 10.0],
               "总胆红素": [2.0, 20.0],
               "总蛋白": [65.0, 85.0],
               "球蛋白": [20.0, 40.0],
               "甘油三脂": [0.45, 1.81],
               "白球比": [1.2, 2.4],
               "白蛋白": [40.0, 55.0],
               "直接胆红素": [0.0, 6.0],
               "碱性磷酸酶": [35, 100],
               "肌酐": [41, 81],
               "肌酸激酶": [0, 171],
               "胆碱脂酶": [5000, 12000],
               "脂蛋白(a)": [0, 300],
               "葡萄糖": [3.90, 6.10],
               "载脂蛋白A1": [1.00, 1.60],
               "载脂蛋白B": [0.60, 1.10],
               "间接胆红素": [2, 18],
               "高密度脂蛋白": [1.29, 1.55]}
    # 判断年龄段
    for key, value in age_group.items():
        if age < value:
            content = key + "，" + content
            break
    # 判断性别
    if sex == 1:
        content = "男性" + content
    else:
        content = "女性" + content
    # 判断各项指标
    for key, value in metrics.items():
        if indicators[key] < value[0]:
            content = key + "偏低" + content
        elif indicators[key] > value[1]:
            content = key + "超标" + content
    return content
if __name__ == '__main__':
    seq = "中年哈哈"
    print(seq_to_vec(seq, config.vocab_path))
