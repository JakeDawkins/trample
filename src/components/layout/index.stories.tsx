import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Layout from '.';
import Docs from './docs';

export default {
  title: 'Layout',
  component: Layout,
  parameters: {
    docs: {
      page: Docs,
    },
  },
} as ComponentMeta<typeof Layout>;

export const Responsive = () => {
  return (
    <Layout>
      <p>sample content</p>
    </Layout>
  );
};
