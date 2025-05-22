import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Optional: Use a Google Font for better look
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYw.woff2' }
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#fff',
    padding: 32,
    fontSize: 12,
    color: '#222',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2 solid #e5e7eb',
    marginBottom: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
  },
  table: {
    width: '100%',
    border: '1 solid #e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1 solid #e5e7eb',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    fontWeight: 'bold',
    color: '#374151',
    fontSize: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    color: '#222',
  },
  totalRow: {
    backgroundColor: '#dbeafe',
    fontWeight: 'bold',
  },
  freeItems: {
    marginTop: 8,
    marginBottom: 8,
  },
  freeItem: {
    fontSize: 11,
    color: '#374151',
    marginLeft: 10,
    marginBottom: 2,
  },
  thanks: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 24,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 12,
    fontSize: 12,
  },
});

const QuotePDF = ({ clientInfo, pages, freeItems, calculateTotal }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>QUOTATION</Text>
        <Text style={styles.date}>Date: {clientInfo.date}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Information</Text>
        <Text style={{ fontSize: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>Project Name: </Text>
          {clientInfo.name || 'N/A'}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Page Details</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Page</Text>
            <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Charge</Text>
          </View>
          {pages.map((page, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{page.name || 'Unnamed Page'}</Text>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>₹{page.charge || 0}</Text>
            </View>
          ))}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.tableCell}>Total</Text>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>₹{calculateTotal()}</Text>
          </View>
        </View>
      </View>
      {freeItems.some(item => item.description) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free Items Included</Text>
          <View style={styles.freeItems}>
            {freeItems.map((item, idx) =>
              item.description ? (
                <Text key={idx} style={styles.freeItem}>• {item.description}</Text>
              ) : null
            )}
          </View>
        </View>
      )}
      <Text style={styles.thanks}>Thank you for the opportunity to work together!</Text>
    </Page>
  </Document>
);

export default QuotePDF;
