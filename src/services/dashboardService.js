/**
 * TODO: Implement a service that coordinates multiple API calls
 *
 * Requirements:
 * 1. Fetch all dashboard data in parallel
 * 2. Handle partial failures gracefully
 * 3. Provide fallback data when services fail
 * 4. Use caching to optimize performance
 */


import cachedFetch from '../utils/asyncPatterns';

export async function fetchDashboardData(city) {
  const names = ['weather', 'forecast', 'news', 'alerts'];

  // Start all four requests at once; allSettled waits for every one, failed or not
  const results = await Promise.allSettled(
    names.map(name =>
      cachedFetch(
        `http://localhost:3001/${name}?city=${encodeURIComponent(city)}`,
        { timeout: 3000 }
      )
    )
  );

  const data = {};
  const errors = {};

  results.forEach((result, index) => {
    const name = names[index];

    if (result.status === 'fulfilled') {
      data[name] = result.value;
      errors[name] = null;
    } else {
      errors[name] = result.reason.message;
    }
  });

  return { data, errors };
}
  const dashboardData = {};

  // Current implementation: Sequential (slow!)
  try {
    const weatherResponse = await fetch(`http://localhost:3001/weather?city=${city}`);
    dashboardData.weather = await weatherResponse.json();
  } catch (error) {
    dashboardData.weather = { error: true };
  }

  try {
    const forecastResponse = await fetch(`http://localhost:3001/forecast?city=${city}`);
    dashboardData.forecast = await forecastResponse.json();
  } catch (error) {
    dashboardData.forecast = { error: true };
  }

  try {
    const newsResponse = await fetch(`http://localhost:3001/news?city=${city}`);
    dashboardData.news = await newsResponse.json();
  } catch (error) {
    dashboardData.news = { error: true };
  }

  try {
    const alertsResponse = await fetch(`http://localhost:3001/alerts?city=${city}`);
    dashboardData.alerts = await alertsResponse.json();
  } catch (error) {
    dashboardData.alerts = { error: true };
  }

  return dashboardData;
