import sys
import torch
import torch.nn.functional as F
import configure as config
from utils import seq_to_vec
from model import TextCNN
from trans import generate_text


def predict(age, sex, content, json_path):
    """
    根据症状描述和体检数据预测患糖尿病概率
    """
    model = torch.load(config.model_path)
    model.eval()
    sequence = generate_text(content, age, sex, json_path)
    vec = seq_to_vec(sequence, config.vocab_path)  # 将序列映射成向量
    input = torch.LongTensor(vec).view(-1, 1)  # 转化成指定输入格式
    target = model(input)
    predict = F.softmax(target.view(-1), dim=0)  # 使用softmax函数得到概率

    return predict[1].item()


if __name__ == '__main__':
    # seq = "中年男性"
    # path = r".\indicators.json"
    # probability = predict(34, '男', "", path)
    # print(predict(34, '男', seq, ""))
    # print(predict(34, '男', seq, path))
    probability = predict(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    with open(r'.\src\DhCNNModel\probability.txt', mode='w', encoding="utf-8") as f:
        f.write(str(probability))
