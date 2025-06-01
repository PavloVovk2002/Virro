// frontend/app/tabs/calendar/index.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';  // 🆕 Add this import

const background = require('../../../assets/images/appBackground.png');
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CalendarScreen() {
  const router = useRouter();
  const { logout } = useAuth();  // 🆕 Use logout function
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'All' | 'Schedule' | 'News'>('All');

  let [fontsLoaded] = useFonts({ Baloo2_700Bold });
  if (!fontsLoaded) return null;

  useEffect(() => {
    console.log('✅ CalendarScreen rendered');
  }, []);

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const getCalendarMatrix = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const matrix: Date[][] = [];
    let dayCounter = 1 - firstDay;

    for (let row = 0; row < 6; row++) {
      const week: Date[] = [];
      for (let col = 0; col < 7; col++) {
        const date = new Date(year, month, dayCounter);
        week.push(date);
        dayCounter++;
      }
      matrix.push(week);
    }
    return matrix;
  };

  const handleSelectDate = (date: Date) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      if (date > selectedStart) {
        setSelectedEnd(date);
      } else {
        setSelectedStart(date);
        setSelectedEnd(null);
      }
    }
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isInRange = (date: Date) => {
    if (!selectedStart || !selectedEnd) return false;
    return date > selectedStart && date < selectedEnd;
  };

  const calendarMatrix = getCalendarMatrix();

  const renderContent = () => {
    switch (activeTab) {
      case 'All':
        return <Text style={styles.tabContent}>📊 Progress Summary for this week</Text>;
      case 'Schedule':
        return <Text style={styles.tabContent}>📅 Your schedule from selected week</Text>;
      case 'News':
        return <Text style={styles.tabContent}>📰 Local news and updates</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.calendarContainer}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goToPrevMonth}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {new Date(year, month).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Day Labels */}
        <View style={styles.daysRow}>
          {DAYS.map((day, index) => (
            <Text key={`${day}-${index}`} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        {calendarMatrix.map((week, rowIdx) => (
          <View key={rowIdx} style={styles.weekRow}>
            {week.map((date, colIdx) => {
              const isCurrentMonth = date.getMonth() === month;
              const isSelectedStart = selectedStart && isSameDay(date, selectedStart);
              const isSelectedEnd = selectedEnd && isSameDay(date, selectedEnd);
              const isBetween = isInRange(date);

              const isStartOrEnd = isSelectedStart || isSelectedEnd;
              const cellStyle = [
                styles.dateCell,
                isBetween && styles.rangeBetween,
                isStartOrEnd && styles.rangeCircle,
              ];

              return (
                <TouchableOpacity
                  key={colIdx}
                  style={cellStyle}
                  onPress={() => handleSelectDate(date)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      !isCurrentMonth && styles.outsideMonth,
                      isStartOrEnd && styles.dateTextSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Bottom Section */}
      <ImageBackground source={background} style={styles.bottomBackground}>
        <View style={styles.tabs}>
          {['All', 'Schedule', 'News'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as 'All' | 'Schedule' | 'News')}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contentBox}>{renderContent()}</View>
      </ImageBackground>

      {/* Drawer */}
      <Modal
        transparent
        animationType="fade"
        visible={drawerVisible}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setDrawerVisible(false)}>
          <View style={styles.drawer}>
            <TouchableOpacity
              onPress={() => {
                setDrawerVisible(false);
                router.push('/tabs/profile');
              }}
            >
              <Text style={styles.drawerItem}>👤 Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setDrawerVisible(false);
                await logout();  // 🆕 Logout
                router.replace('/login');
              }}
            >
              <Text style={styles.drawerItem}>🚪 Log Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#3f5c2e' },
  calendarContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 24,
    color: '#fff',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#ccc',
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
  },
  outsideMonth: {
    color: '#888',
  },
  rangeCircle: {
    backgroundColor: '#5D8748',
    borderRadius: 50,
  },
  rangeBetween: {
    backgroundColor: '#A1BC8F',
  },
  dateTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  bottomBackground: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#3f5c2e',
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
  },
  contentBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  tabContent: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  drawer: {
    width: 240,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerItem: {
    fontSize: 18,
    marginVertical: 16,
    color: '#333',
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
