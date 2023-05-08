import React, { useState } from "react";
import "./styles.css";
import initialTransactions from "./InitialTransaction";

function getItemsFromLocalStorage() {
  const saved = localStorage.getItem("transactions");
  const initialValue = JSON.parse(saved) || initialTransactions;
  return initialValue;
}

export default function Transaction() {
  const [transactions, setTransactions] = useState(
    getItemsFromLocalStorage
  );
  const [itemId, setItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("none");
  const [summarizedData, setSummarizedData] = useState(null); //  handle summarize


  function addTransaction() {
    const newTransaction = {
      itemId: itemId,
      amount: amount,
      category: category,
      date: date,
      description: description
    };
    setTransactions([...transactions, newTransaction]);
    setItemId("");
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
  }

  function deleteTransaction(index) {
    const newTransactions = [...transactions];
    newTransactions.splice(index, 1);
    setTransactions(newTransactions);
  }

  const summarizeByDate = (transactions) => {
    const summarizedData = {};
    for (const transaction of transactions) {
      const date = transaction.date;
      const amount = Number(transaction.amount);
      if (summarizedData[date]) {
        summarizedData[date] += amount;
      } else {
        summarizedData[date] = amount;
      }
    }
    return summarizedData;
  };

  function summarizeByMonth() {
    const summary = {};
    transactions.forEach((transaction) => {
      const [year, month] = transaction.date.split("-");
      const date = `${year}-${month}`;
      const amount = parseFloat(transaction.amount);
      if (summary[date]) {
        summary[date] += amount;
      } else {
        summary[date] = amount;
      }
    });
    return summary;
  }

  function summarizeByYear() {
    const summary = {};
    transactions.forEach((transaction) => {
      const year = transaction.date.split("-")[0];
      const amount = parseFloat(transaction.amount);
      if (summary[year]) {
        summary[year] += amount;
      } else {
        summary[year] = amount;
      }
    });
    return summary;
  }

  function summarizeByCategory() {
    const summary = {};
    transactions.forEach((transaction) => {
      const category = transaction.category;
      const amount = parseFloat(transaction.amount);
      if (summary[category]) {
        summary[category] += amount;
      } else {
        summary[category] = amount;
      }
    });
    return summary;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "itemId") {
      setItemId(value);
    } else if (name === "amount") {
      setAmount(value);
    } else if (name === "category") {
      setCategory(value);
    } else if (name === "date") {
      setDate(value);
    } else if (name === "description") {
      setDescription(value);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    addTransaction();
  }

  function handleDelete(index) {
    deleteTransaction(index);
  }

  function quit() {
    const confirmed = window.confirm('Are you sure you want to quit?');
    if (confirmed) {
        window.location.replace('/');
    }
  }
  

  const onSummarizeByDateClick = () => {
    setSummarizedData(summarizeByDate(transactions));
  };

  const onSummarizeByMonthClick = () => {
    setSummarizedData(summarizeByMonth(transactions));
  };

  const onSummarizeByYearClick = () => {
    setSummarizedData(summarizeByYear(transactions));
  };

  const onSummarizeByCategoryClick = () => {
    setSummarizedData(summarizeByCategory(transactions));
  };
  
  return (
    <div className="App">
      <h1>Transaction App</h1>
      <div className="form">
        <tr>
        <label>
          Item ID:
          <input type="text" name="itemId" value={itemId} onChange={handleChange} />
        </label>
        </tr>
        <tr>
        <label>
          Amount:
          <input type="number" name="amount" value={amount} onChange={handleChange} />
        </label>
        </tr>
        <tr>
        <label>
          Category:
          <input type="text" name="category" value={category} onChange={handleChange} />
        </label>
        </tr>
        <tr>
        <label>
          Date:
          <input type="date" name="date" value={date} onChange={handleChange} />
        </label>
        </tr>
        <tr>
        <label>
          Description:
          <input type="text" name="description" value={description} onChange={handleChange} />
        </label>
        </tr>
        <tr>
        <button onClick={handleSubmit}>Add Transaction</button>
        </tr>
      </div>
      <div>
      <h2>Transactions</h2>
        <table>
        <thead>
            <tr>
            <th>Item ID</th>
            <th>Amount  </th>
            <th>Category  </th>
            <th>Date  </th>
            <th>Description  </th>
            <th>Delete  </th>
            </tr>
        </thead>
        <tbody>
            {transactions.map((transaction, index) => (
            <tr key={index}>
                <td>{transaction.itemId}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td><button onClick={() => handleDelete(index)}>Delete</button></td>
            </tr>
            ))}
        </tbody>
        </table>
      </div>
      <button onClick={onSummarizeByDateClick}>Summarize by Date</button>
      <button onClick={onSummarizeByMonthClick}>Summarize by Month</button>
      <button onClick={onSummarizeByYearClick}>Summarize by Year</button>
      <button onClick={onSummarizeByCategoryClick}>Summarize by Category</button>
      <button onClick={quit}>Quit</button>

    {summarizedData && (
    <div>
    <h2>Summarized Data</h2>
    <ul>
      {Object.keys(summarizedData).map((date) => (
        <li key={date}>{`${date}: ${summarizedData[date]}`}</li>
      ))}
        </ul>
    </div>
        )}


    </div>
  );
}