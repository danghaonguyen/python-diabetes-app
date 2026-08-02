import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


# Hàm vẽ biểu đồ cột thể hiện tỷ lệ mắc bệnh tiểu đường
def plot_distribution(df):
    # Vẽ số lượng người mắc và không mắc bệnh
    sns.countplot(data=df, x='diabetes')
    plt.title('Tỷ lệ mắc bệnh tiểu đường')  # Tiêu đề biểu đồ
    plt.xlabel('0 = Không mắc | 1 = Mắc bệnh')  # Ghi chú trục X
    plt.ylabel('Số lượng')  # Ghi chú trục Y
    plt.show()

# Hàm vẽ biểu đồ boxplot để so sánh các đặc trưng theo tình trạng bệnh
def plot_boxplots(df):
    for col in ['age', 'bmi', 'blood_glucose_level']:
        # Vẽ boxplot phân chia theo diabetes = 0 hoặc 1
        sns.boxplot(data=df, x='diabetes', y=col)
        plt.title(f'So sánh {col.upper()} theo tình trạng bệnh')  # Tiêu đề biểu đồ
        plt.xlabel('Diabetes (0 = Không mắc, 1 = Mắc)')  # Nhãn trục X
        plt.ylabel(col.upper())  # Nhãn trục Y theo từng thuộc tính
        plt.show()

# Hàm vẽ biểu đồ heatmap thể hiện ma trận tương quan giữa các biến
def plot_correlation(df):
    # Thiết lập kích thước biểu đồ
    plt.figure(figsize=(8,6))
    # Vẽ ma trận tương quan giữa các cột số
    sns.heatmap(df.corr(), annot=True, cmap='Blues', fmt='.2f')
    plt.title('Ma trận tương quan giữa các thuộc tính')  # Tiêu đề biểu đồ
    plt.show()

# Hàm vẽ biểu đồ thể hiện số lượng người mắc bệnh theo độ tuổi nhất định từ 0 -> 80
def plot_diabetes_by_age(df):
   # Làm tròn tuổi về số nguyên
    df['age'] = df['age'].astype(int)

    # Lọc dữ liệu từ tuổi 0 đến 80
    df = df[(df['age'] >= 0) & (df['age'] <= 80)]

    # Lọc người mắc bệnh
    diabetic_data = df[df['diabetes'] == 1]

    # Tạo danh sách đầy đủ các độ tuổi từ 0 đến 80
    all_ages = np.arange(0, 81)

    # Đếm số lượng người mắc bệnh theo độ tuổi, bao gồm cả tuổi không có ca bệnh
    age_counts = diabetic_data['age'].value_counts().reindex(all_ages, fill_value=0)

    # Vẽ biểu đồ
    plt.figure(figsize=(14,6))
    sns.barplot(x=age_counts.index, y=age_counts.values, palette='viridis')
    plt.title('Số lượng người mắc bệnh tiểu đường theo độ tuổi (từ 0 đến 80)')
    plt.xlabel('Tuổi')
    plt.ylabel('Số người mắc')
    plt.xticks(rotation=0)
    plt.tight_layout()
    plt.show()


def plot_diabetes_by_age_group(df):
    import seaborn as sns
    import matplotlib.pyplot as plt

    # Chỉ lấy những người MẮC bệnh tiểu đường
    has_diabetes_df = df[df['diabetes'] == 1]

    # Tạo nhóm tuổi (bins)
    bins = [0, 10, 20, 30, 40, 50, 60, 70, 100]
    labels = ['dưới 10 tuổi', '11-20 tuổi', '21-30 tuổi', '31-40 tuổi', '41-50 tuổi',
              '51-60 tuổi', '61-70 tuổi', '70+ tuổi']

    # Gán nhóm tuổi vào cột mới
    has_diabetes_df['age_group'] = pd.cut(has_diabetes_df['age'], bins=bins, labels=labels, right=False)

    # Đếm số người mắc bệnh theo nhóm tuổi
    age_counts = has_diabetes_df['age_group'].value_counts().sort_index()

    # Vẽ biểu đồ dạng ngang
    plt.figure(figsize=(10, 6))
    sns.barplot(x=age_counts.values, y=age_counts.index, palette='viridis')
    plt.title('Sự phân bố tuổi tác của các bệnh nhân tiểu đường')
    plt.xlabel('Số người bệnh')
    plt.ylabel('Nhóm tuổi')
    plt.tight_layout()
    plt.show()

def plot_diabetes_by_glucose_range(df):
 
    # Lọc chỉ những người có tiểu đường
    diabetic = df[df['diabetes'] == 1].copy()

    # Nhóm theo mức đường huyết (blood_glucose_level)
    bins = [0, 99, 150, 200, float('inf')]
    labels = ['dưới 100', '100 - 150', '151 - 200', 'trên 200']
    diabetic['glucose_group'] = pd.cut(diabetic['blood_glucose_level'], bins=bins, labels=labels)

    # Đếm số lượng mỗi nhóm
    glucose_counts = diabetic['glucose_group'].value_counts().sort_index()

    # Vẽ biểu đồ ngang
    plt.figure(figsize=(10, 5))
    sns.barplot(x=glucose_counts.values, y=glucose_counts.index, palette='Spectral')
    plt.title('Bệnh tiểu đường dựa theo chỉ số lượng đường trong máu')
    plt.xlabel('Số người bệnh')
    plt.ylabel('Lượng đường trong máu')
    plt.tight_layout()
    plt.show()