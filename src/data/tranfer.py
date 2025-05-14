import pandas as pd

df = pd.read_csv('dataset_final.csv')
df.to_json('dataset_final.json', orient='records')
