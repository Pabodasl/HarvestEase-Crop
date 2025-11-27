import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import logo from '../assets/Yellow Vintage Wheat Rice Oats logo.png';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
  },
  reportInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    padding: 8,
    fontSize: 12,
  },
  indexCell: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
  },
  nameCell: {
    width: '85%',
  },
});

const DiseasePDF = ({ diseases }) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm a');
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <Text style={styles.title}>HarvestEase</Text>
        </View>

        {/* Report Information */}
        <View style={styles.reportInfo}>
          <Text style={styles.infoText}>Report Generated: {currentDate}</Text>
          <Text style={styles.infoText}>Total Diseases: {diseases.length}</Text>
        </View>

        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCell, styles.indexCell]}>
            <Text>No.</Text>
          </View>
          <View style={[styles.tableCell, styles.nameCell]}>
            <Text>Disease Name</Text>
          </View>
        </View>

        {/* Table Content */}
        {diseases.map((disease, index) => (
          <View key={disease._id} style={styles.tableRow}>
            <View style={[styles.tableCell, styles.indexCell]}>
              <Text>{index + 1}</Text>
            </View>
            <View style={[styles.tableCell, styles.nameCell]}>
              <Text>{disease.diseaseName}</Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default DiseasePDF; 