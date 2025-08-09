import os
import pandas as pd
from sqlalchemy import create_engine
from langchain_community.agent_toolkits import create_sql_agent
from langchain_openai import OpenAI

def get_query_response(filename: str, query: str):
    """
    Takes a filename and a natural language query, and returns the response from a LangChain SQL agent.
    """
    file_path = os.path.join("uploads", filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}

    # Load the CSV into a pandas DataFrame
    df = pd.read_csv(file_path)

    # Create an in-memory SQLite database
    engine = create_engine("sqlite:///:memory:")

    # Write the DataFrame to a table in the SQLite database
    table_name = os.path.splitext(filename)[0]
    df.to_sql(table_name, engine, index=False)

    # Create a LangChain SQL agent
    llm = OpenAI(temperature=0)
    agent_executor = create_sql_agent(llm, db=engine, agent_type="openai-tools", verbose=True)

    # Run the agent with the natural language query
    response = agent_executor.invoke({"input": query}, return_intermediate_steps=True)

    # Extract the SQL query and result
    sql_query = ""
    for step in response["intermediate_steps"]:
        if "sql_query" in step:
            sql_query = step["sql_query"]
            break

    result_df = pd.DataFrame()
    if sql_query:
        result_df = pd.read_sql(sql_query, engine)

    visualization = get_visualization(result_df)

    return {"result": response["output"], "visualization": visualization}

def get_visualization(df: pd.DataFrame):
    """
    Analyzes a DataFrame and returns a suggested visualization type and data.
    """
    if df.empty:
        return None

    # Simplified logic to determine visualization type
    num_cols = len(df.columns)
    if num_cols == 2:
        col1_type = str(df.dtypes[0])
        col2_type = str(df.dtypes[1])

        if "datetime" in col1_type and ("int" in col2_type or "float" in col2_type):
            return {
                "type": "line",
                "data": {
                    "labels": df.iloc[:, 0].tolist(),
                    "datasets": [{"label": df.columns[1], "data": df.iloc[:, 1].tolist()}],
                },
            }
        elif ("object" in col1_type or "category" in col1_type) and ("int" in col2_type or "float" in col2_type):
            return {
                "type": "bar",
                "data": {
                    "labels": df.iloc[:, 0].tolist(),
                    "datasets": [{"label": df.columns[1], "data": df.iloc[:, 1].tolist()}],
                },
            }

    # Default to table view if no specific chart type is identified
    return {
        "type": "table",
        "data": {
            "columns": df.columns.tolist(),
            "rows": df.to_dict(orient="records"),
        },
    }
