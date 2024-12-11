import { HttpService } from 'common/services/http';

import { Tool } from '../models/Tool';
import { SqlApiService } from '../services/sqlApi.service';
import type { ToolsConfig } from '../types/toolService.interface';

const httpService = new HttpService('https://centrala.ag3nts.org', process.env.API_KEY);

export const toolsConfig: ToolsConfig = {
  sql: new Tool({
    name: 'sql',
    description: `
        Query MySQL database.
        Always use this tool to get information from the database.
        Accept any valid MySQL query in 'query' field with two additional special queries:
        - 'show tables' - list all tables in the database
        - 'show create table {TABLE_NAME} ' - show create table statement for the given table
        Always use this additional queries to get yourself familiar with the database structure and data you can use to answer the user question
    `,
    service: new SqlApiService(httpService, '/apidb'),
    answer: 'json',
  }),
};
