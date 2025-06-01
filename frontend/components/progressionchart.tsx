// frontend/components/ProgressionChart.tsx

import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export type DataPoint = {
  day: string;
  completed: number;
  inProgress: number;
};

type Props = { data: DataPoint[] };

export default function ProgressionChart({ data }: Props) {
  const labels = data.map(d => d.day);
  const completedData = data.map(d => d.completed);
  const inProgressData = data.map(d => d.inProgress);

  const chartData = {
    labels,
    datasets: [
      {
        data: completedData,
        color: (opacity = 1) => `rgba(46,125,50,${opacity})`,
      },
      {
        data: inProgressData,
        color: (opacity = 1) => `rgba(251,192,45,${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#edf7ed',
    backgroundGradientTo: '#edf7ed',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34,139,34,${opacity})`,
    barPercentage: 0.5,
  };

  return (
    <View style={styles.wrapper}>
      {/* Optional Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: 'rgba(46,125,50,1)' }]} />
          <Text style={styles.legendLabel}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColorBox, { backgroundColor: 'rgba(251,192,45,1)' }]} />
          <Text style={styles.legendLabel}>In Progress</Text>
        </View>
      </View>

      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 32}
        height={200}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        withInnerLines={false}
        showBarTops
        chartConfig={chartConfig}
        style={{ borderRadius: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: '#333',
  },
});
