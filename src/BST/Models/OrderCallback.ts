"use strict";
import type { BSTNodeComparisonCallbackType, BSTNodeValueComparisonCallbackType } from "../../../Types";

/**
 * Compares two BST nodes based on their IDs.
 */
export const CompareNodes: BSTNodeComparisonCallbackType = (x, y) =>
  x.id < y.id ? -1 : x.id === y.id ? 0 : 1;

/**
 * Compares a BST node with a given value based on the node's ID.
 */
export const CompareNodeWithValue: BSTNodeValueComparisonCallbackType = (
  x,
  value,
) => x.id > value ? -1 : x.id === value ? 0 : 1;
