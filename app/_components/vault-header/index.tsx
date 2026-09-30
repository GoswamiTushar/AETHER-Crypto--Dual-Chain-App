'use client';

import React from 'react';
import { VaultHeaderProps } from './types';
import { VaultHeaderView } from './view';

export function VaultHeader(props: VaultHeaderProps) {
  return <VaultHeaderView {...props} />;
}
