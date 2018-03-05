// package
import React, { Component } from 'react';
import calendar from 'github-calendar';
import sortBy from 'lodash.sortby';
import axios from 'axios';
import "babel-polyfill";

// local
import './index.less';
import ReactChart from './reactChart.jsx';
import Loading from '../../feature/Loading/index.jsx';

// TODO
// 1.css modules
// 3.make it as my personal package

export default class Github extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langColor: {
        unknow: '#000',
      },
      viewer: {
        name: 'peng',
        avatarUrl: 'http?',
        bio: '我的经历',
        createdAt: '公元前',
        followers: {
          totalCount: 0,
        },
        following: {
          totalCount: 0,
        },
      },
      starredLanguage: undefined,
      oldestRepostort: {
        name: '某个库',
        updatedAt: '今天',
        createdAt: '公元前',
      },
    };
  }
  getData = args => {
    return new Promise((resolve,reject)=>{
      axios({
        url: '/graphql',
        method: 'post',
        // url: `https://api.github.com/graphql`,
				// method: 'post',
				// headers: {
				// 	'Authorization': `bearer ${process.env.access_token}`,
				// 	'Content-Type': 'application/json'
				// },
        data: {
          query: `{
            viewer {
              avatarUrl login bio url createdAt
              contributedRepositories(first: 100,orderBy: {field: CREATED_AT, direction: DESC}) {
                totalCount
                nodes{
                  nameWithOwner url
                }
              }
              starredRepositories(first:100) {
                nodes {
                  primaryLanguage {
                    name color
                  }
                }
              }
              followers(first: 100) {
                totalCount
                nodes {
                  url name avatarUrl
                }
              }
              following(first: 100) {
                totalCount
                nodes {
                  url name avatarUrl
                }
              }
              repositories(first:100,orderBy: {field: STARGAZERS, direction: DESC}){
                totalCount
                nodes{
                  createdAt updatedAt isFork name url
                  primaryLanguage {
                    name
                  }
                  forks(first:0){
                    totalCount
                  }
                  stargazers(first:0){
                    totalCount
                  }
                }
              }
            }
          }`,
        },
      }).then(res => resolve(res.data.data))
        .catch(err => reject(err))
    })
  }

  async componentDidMount() {
    const { langColor } = this.state;
    const res = (localStorage.githubReport && JSON.parse(localStorage.githubReport)) || await this.getData();
    localStorage.setItem('githubReport', JSON.stringify({...res}));
    const { viewer } = res;
    this.setState({
      viewer,
      oldestRepostort: sortBy(viewer.repositories.nodes
        .filter(repo => !repo.isFork)
        .map((repo) => {
          return {
            time: new Date(repo.updatedAt) - new Date(repo.createdAt),
            name: repo.name,
            url: repo.url,
            updatedAt: repo.updatedAt,
            createdAt: repo.createdAt,
          };
        }), e => -e.time)[0],
    });
    const objectRank = viewer.starredRepositories.nodes
      .map(arr => {
        if (arr.primaryLanguage) {
          langColor[arr.primaryLanguage.name] = arr.primaryLanguage.color;
          return arr.primaryLanguage.name;
        };
        return 'unknow';
      })
      .reduce((acc, curr) => {
        if (typeof acc[curr] === 'undefined') {
          acc[curr] = 1;
        } else {
          acc[curr] += 1;
        }
        return acc;
      }, {});
    this.setState({
      starredLanguage: sortBy(Object.keys(objectRank)
        .map(arr => {
          return {
            name: arr,
            count: objectRank[arr],
            color: langColor[arr],
          }
        }), o => -o.count),
    });
    setTimeout(() => {
      calendar(this.container, viewer.login);
    }, 0);
  }
  render() {
    const {
      viewer, oldestRepostort, starredLanguage,
    } = this.state;
    return starredLanguage ? (
      <div className="github">
        <h2 className="title">活跃度</h2>
        <div ref={c => { this.container = c}} className="calendar" />
        <h2 className="title">基本信息</h2>
        <div className="basic">
          <div className="detail">
            <img src={viewer.avatarUrl} alt="" />
            <div className="detail-container">
              <p className="name">{viewer.login}</p>
              <p className="join-time">加入时间：{
                  (new Date(viewer.createdAt))
                    .toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                }
              </p>
              <p className="career-time">
                编程经历：{
                  ((new Date() - new Date(viewer.createdAt)) / 1000 / 3600 / 24 / 365).toFixed(1)
                }
              </p>
              <p className="bio">{viewer.bio}</p>
            </div>
          </div>
          <div className="repositories">
            <span className="num">
              {viewer.repositories.totalCount}
            </span>
            Repositories
          </div>
          <div className="followers">
            <span className="num">
              {viewer.followers.totalCount}
            </span>
            Followers
          </div>
          <div className="following">
            <span className="num">
              {viewer.following.totalCount}
            </span>
            Following
          </div>
        </div>
        <h2 className="title">仓库信息</h2>
        <div className="repository">
          <div className="repository-star">
            <span className="show" role="img" aria-label="star">
              ⭐{viewer.repositories.nodes.map(rep => rep.stargazers.totalCount)
                .reduce((a, b) => a + b)}
            </span>
            <span>收获的Star数</span>
          </div>
          <div className="repository-fork">
            <span className="show" role="img" aria-label="fork">
              🍴&nbsp;{viewer.repositories.nodes
                .map(rep => rep.forks.totalCount)
                .reduce((a, b) => a + b)}
            </span>
            <span>收获的Fork数</span>
          </div>
          <div className="repository-my">
            <span className="show" role="img" aria-label="repository">
              🏬{viewer.repositories.nodes
                .filter(repo => !repo.isFork).length}
            </span>
            <span>原创Repository数</span>
          </div>
          <div className="repository-popular">
            <span className="show" role="img" aria-label="popular">
              🎉
              <a target="_blank" href={viewer.repositories.nodes[0].url}>
                {viewer.repositories.nodes[0].name}
              </a>
            </span>
            <span>最受欢迎的库</span>
          </div>
          <div className="repository-oldest" role="img" aria-label="oldest">
            <a target="_blank" href={oldestRepostort.url} className="show">
              {oldestRepostort.name}
            </a>
            🕘{(new Date(oldestRepostort.createdAt)).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })} ~ {(new Date(oldestRepostort.updatedAt)).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
            <span>贡献最久的库</span>
          </div>
          <div className="repository-chart">
            <ReactChart
              type="pie"
              data={{
                labels: ['原创仓库', 'Fork'],
                datasets: [{
                  data: [
                    viewer.repositories.nodes
                      .filter(repo => !repo.isFork).length,
                      viewer.repositories.nodes
                      .filter(repo => repo.isFork).length,
                  ],
                  backgroundColor: ['#4CAF50'],
                  hoverBackgroundColor: ['#4CAF50'],
                }],
              }}
              options={{
                title: {
                  display: true,
                  text: `${((viewer.repositories.nodes.filter(repo => !repo.isFork).length / viewer.repositories.totalCount) * 100).toFixed(0)}% 原创仓库`,
                },
                cutoutPercentage: 50,
              }}
            />
            <ReactChart
              type="pie"
              data={{
                labels: viewer.repositories.nodes.map(rep => rep.name),
                datasets: [{
                  data: viewer.repositories.nodes.map(rep => rep.stargazers.totalCount),
                  backgroundColor: ['#4CAF50', '#A5D6A7', '#E8F5E9'],
                  hoverBackgroundColor: ['#4CAF50', '#A5D6A7', '#E8F5E9'],
                }],
              }}
              options={{
                title: {
                  display: true,
                  text: 'Star比例',
                },
                cutoutPercentage: 50,
                legend: {
                  display: false,
                },
              }}
            />
            <ReactChart
              type="pie"
              data={{
                labels: starredLanguage.map(lang => lang.name),
                datasets: [{
                  data: starredLanguage.map(lang => lang.count),
                  backgroundColor: starredLanguage.map(lang => lang.color),
                  hoverBackgroundColor: starredLanguage.map(lang => lang.color),
                }],
              }}
              options={{
                title: {
                  display: true,
                  text: 'Star语言偏好',
                },
                cutoutPercentage: 50,
                legend: { display: false },
              }}
            />
          </div>
          <div className="repository-contribute">
            <h2 className="title">参与贡献了{viewer.contributedRepositories.totalCount}个项目</h2>
            {viewer.contributedRepositories.nodes.map((repo, i) => (
              <a target="_blank" className="list" key={i} href={repo.url}>@{repo.nameWithOwner}</a>
            ))}
          </div>
        </div>
        <h2 className="title">感谢支持我的人</h2>
        <div className="followers-container">
          {starredLanguage && viewer.followers.nodes.map((arr, i) => (
            <a target="_blank" href={arr.url} key={i} className="list">
              <img src={arr.avatarUrl} alt={arr.name} />
              <span className="name">{arr.name}</span>
            </a>
          ))}
        </div>
        <h2 className="title">追寻的大牛</h2>
        <div className="following-container">
          {starredLanguage && viewer.following.nodes.map((arr, i) => (
            <a target="_blank" href={arr.url} key={i} className="list">
              <img src={arr.avatarUrl} alt={arr.name} />
              <span className="name">{arr.name}</span>
            </a>
          ))}
        </div>
      </div>
    ) : <Loading />;
  }
}