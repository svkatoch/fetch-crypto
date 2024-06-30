document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/get-data');
      const data = await response.json();
  
      const tbody = document.querySelector('table tbody');
      tbody.innerHTML = ''; // Clear existing rows
  
      data.forEach((item, index) => {
        const row = document.createElement('tr');
  
        const cellIndex = document.createElement('td');
        cellIndex.textContent = index + 1;
  
        const cellName = document.createElement('td');
        cellName.textContent = item.name;
  
        const cellLast = document.createElement('td');
        cellLast.textContent = item.last;
  
        const cellBuySell = document.createElement('td');
        cellBuySell.textContent = `${item.buy} / ${item.sell}`;
  
        const cellChange = document.createElement('td');
        // Example change calculation, replace with actual logic
        const change = ((item.sell - item.buy) / item.buy) * 100;
        cellChange.textContent = `${change.toFixed(2)}%`;
        cellChange.className = change >= 0 ? 'change up' : 'change down';
  
        const cellSavings = document.createElement('td');
        // Example savings calculation, replace with actual logic
        const savings = item.sell - item.buy;
        cellSavings.textContent = `₹${savings.toFixed(2)}`;
        cellSavings.className = savings >= 0 ? 'change up' : 'change down';
  
        row.appendChild(cellIndex);
        row.appendChild(cellName);
        row.appendChild(cellLast);
        row.appendChild(cellBuySell);
        row.appendChild(cellChange);
        row.appendChild(cellSavings);
  
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
  