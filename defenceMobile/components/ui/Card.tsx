import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

type CardProps = ViewProps;
type CardTextProps = TextProps;

export function Card({ style, ...props }: CardProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function CardHeader({ style, ...props }: CardProps) {
  return <View style={[styles.cardHeader, style]} {...props} />;
}

export function CardTitle({ style, ...props }: CardTextProps) {
  return <Text style={[styles.cardTitle, style]} {...props} />;
}

export function CardDescription({ style, ...props }: CardTextProps) {
  return <Text style={[styles.cardDescription, style]} {...props} />;
}

export function CardAction({ style, ...props }: CardProps) {
  return <View style={[styles.cardAction, style]} {...props} />;
}

export function CardContent({ style, ...props }: CardProps) {
  return <View style={[styles.cardContent, style]} {...props} />;
}

export function CardFooter({ style, ...props }: CardProps) {
  return <View style={[styles.cardFooter, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "column",
    gap: 12, // działa w RN >= 0.71
    padding: 0, // dodasz w CardContent / CardHeader
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDescription: {
    color: "#6B7280",
    fontSize: 14,
  },
  cardAction: {
    alignSelf: "flex-end",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
