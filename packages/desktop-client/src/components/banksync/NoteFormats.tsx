import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { SvgAdd, SvgDelete } from '@actual-app/components/icons/v0';
import {
  SvgArrowThinDown,
  SvgArrowThinUp,
  SvgQuestion,
} from '@actual-app/components/icons/v1';
import { Input } from '@actual-app/components/input';
import { SpaceBetween } from '@actual-app/components/space-between';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { v4 as uuidv4 } from 'uuid';

import type { NoteFormat } from './useBankSyncAccountSettings';

type NoteFormatsProps = {
  formats: NoteFormat[];
  onChange: (formats: NoteFormat[]) => void;
};

function PlaceholderHelp() {
  const { t } = useTranslation();

  const rows: [string, string][] = [
    ['%d%', t('Day without leading zero (1–2 digits)')],
    ['%dd%', t('Day with leading zero (2 digits)')],
    ['%m%', t('Month without leading zero (1–2 digits)')],
    ['%mm%', t('Month with leading zero (2 digits)')],
    ['%yy%', t('Year — last 2 digits')],
    ['%yyyy%', t('Year — 4 digits')],
    ['%a%', t('Amount')],
    ['%p%', t('Payee')],
    ['%pp%', t('Imported payee')],
    ['%n%', t('Notes')],
  ];

  return (
    <View style={{ padding: '4px 2px' }}>
      {rows.map(([token, description]) => (
        <SpaceBetween key={token} gap={12} style={{ marginBottom: 3 }}>
          <Text
            style={{
              fontFamily: 'monospace',
              color: theme.tableText,
              minWidth: 70,
            }}
          >
            {token}
          </Text>
          <Text style={{ color: theme.tableText }}>{description}</Text>
        </SpaceBetween>
      ))}
    </View>
  );
}

export function NoteFormats({ formats, onChange }: NoteFormatsProps) {
  const { t } = useTranslation();

  function handleAdd() {
    onChange([...formats, { id: uuidv4(), pattern: '' }]);
  }

  function handleDelete(id: string) {
    onChange(formats.filter(f => f.id !== id));
  }

  function handleChange(id: string, pattern: string) {
    onChange(formats.map(f => (f.id === id ? { ...f, pattern } : f)));
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...formats];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function handleMoveDown(index: number) {
    if (index === formats.length - 1) return;
    const next = [...formats];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <>
      {formats.map((fmt, index) => (
        <SpaceBetween
          key={fmt.id}
          gap={5}
          style={{ alignItems: 'center', marginBottom: 5 }}
        >
          <Input
            value={fmt.pattern}
            onChange={e => handleChange(fmt.id, e.target.value)}
            placeholder={t('e.g. %yyyy%-%mm%-%dd% %p%')}
            style={{ flex: 1 }}
          />
          <Button
            variant="bare"
            onPress={() => handleMoveUp(index)}
            isDisabled={index === 0}
            aria-label={t('Move up')}
          >
            <SvgArrowThinUp width={10} height={10} />
          </Button>
          <Button
            variant="bare"
            onPress={() => handleMoveDown(index)}
            isDisabled={index === formats.length - 1}
            aria-label={t('Move down')}
          >
            <SvgArrowThinDown width={10} height={10} />
          </Button>
          <Button
            variant="bare"
            onPress={() => handleDelete(fmt.id)}
            aria-label={t('Delete format')}
          >
            <SvgDelete width={7} height={7} />
          </Button>
        </SpaceBetween>
      ))}
      <SpaceBetween gap={8} style={{ marginTop: 5, alignItems: 'center' }}>
        <Button
          variant="bare"
          onPress={handleAdd}
          style={{ alignSelf: 'flex-start' }}
        >
          <SvgAdd width={10} height={10} style={{ marginRight: 5 }} />
          <Trans>Add format</Trans>
        </Button>
        <Tooltip content={<PlaceholderHelp />} placement="bottom start">
          <Button variant="bare" aria-label={t('Placeholder reference')}>
            <SvgQuestion width={13} height={13} />
          </Button>
        </Tooltip>
      </SpaceBetween>
    </>
  );
}
