import {WorkspaceComponent} from './workspace.component';
import {PageNotFoundComponent} from './not-found.component';

export const workspaceRoutes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '', redirectTo: 'article-list', pathMatch: 'full'
      },
      {
        path: 'article-list',
        loadChildren: './library/article-list/article-list.module#ArticleListModule',
        data: {preload: true}
      },
      {
        path: `article/:id`,
        loadChildren: './library/article/article.module#ArticleModule',
        data: {preload: true}
      },
      {
        path: 'draft',
        loadChildren: './library/draft/draft.module#DraftModule',
        data: {preload: true}
      },
      {
        path: 'livelist',
        loadChildren: './live/livelist/livelist.module#LivelistModule',
        data: {preload: true}
      },
      {
        path: 'createlive',
        loadChildren: './live/createlive/createlive.module#CreateliveModule',
        data: {preload: true}
      },
      {
        path: '**',
        component: PageNotFoundComponent
      },
    ]
  }
];
