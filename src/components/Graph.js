/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { Sigma, EdgeShapes, RelativeSize } from 'react-sigma';

export function Graph({ data }) {
  useEffect(() => {
    setData();
  }, []);


  /**
   * Calculates the Y position of the node
   * @param {number} total
   * @param {number} position
   * @returns {number} - yPosition
   */
  function getYPosition(total, position) {
    const min = - 0.5,
      max = 0.5,
      diff = (max - min),
      n = total,
      ns = [];

    switch (total) {
      case 1:
        return 0;
      case 2:
        return [min, max][position];
      case 3:
        return [min, 0, max][position];
      default:
        for (let i = 0 ;i < n - 2 ;i += 1) {
          ns.push((min + (diff / (n - 1))) * i);
        }
        return [...ns.filter(val => val < 0).sort((a, b)=> a > b),...ns.map(e => e * -1).sort()][position];
    }
  }

  /**
   * Create the ids of the critical path edges
   * @returns {string[]}
   */
  function getEdgeCombinations() {
    return data.criticalPath
      .map(([val]) => val.name)
      .map((val, i, array) => {
        return array[i - 1] ? `${val}-${array[i - 1]}` : null;
      })
      .filter(val => val);
  }

  /**
   * Verifies if the activity is part of the critical path
   * @param {string} activity
   * @returns {boolean}
   */
  function isCriticalActivity(activity) {
    return data.criticalPath.map(([val]) => val.name).indexOf(activity) !== -1;
  }

  /**
   * Verifies if the edge is part of the critical path
   * @param {string} edge
   * @returns {boolean}
   */
  function isCriticalEdge(edge) {
    return getEdgeCombinations().indexOf(edge) !== -1;
  }

  const [graph, setGraph] = useState(),
    settings = {
      drawEdges: true,
      drawEdgeLabels: true,
      clone: false,
      immutable: false,
      defaultLabelSize: 18,
      defaultLabelColor: '#2828282',
      labelColor: 'default',
      maxEdgeSize: 4,
      maxNodeSize: 15,
      touchEnabled: false,
      mouseEnabled: false

    },
    setData = () => {
      const nodeColor = '#3f51b5',
        nodeSize = 10,
        edgeColor = '#606060',
        edgeFake = '#909090',
        edgeCritical = '#D32F2F',
        edgeSize = 1,
        g = {
            nodes: [{
              id: 'node-1',
              label: '1',
              x: 0,
              y: 0,
              size: nodeSize,
              color: nodeColor
            }],
            edges: []
          };

      let x = 1,
        y = 1,
        count = 1,
        node = 1;

        data.groupedActivitiesDone.forEach(activitiesArray => {
          y = 1;
          activitiesArray.forEach(({ name }, i, array) => {
            g.nodes.push({
              id: `node-${count + 1}`,
              label: `${count + 1}`,
              x,
              y: getYPosition(array.length, i),
              size: nodeSize,
              color: nodeColor
            });
            count += 1;
          });
          x += 1;
        });

      data.groupedActivitiesDone.forEach(activities => {
        let count = 0;

        activities.forEach( ({name, expectedTime}, i) => {
          g.edges.push({
            id: `${node}-${node + i + 1}`,
            source: `node-${node}`,
            target: `node-${node + i + 1}`,
            label: `${name} (${expectedTime})`,
            size: edgeSize,
            color: isCriticalActivity(name) ? edgeCritical : edgeColor
          });

          if (i) {
            g.edges.push({
              id: `${node + 1 }-${node + i + 1}`,
              source: `node-${node + 1}`,
              target: `node-${node + i + 1}`,
              label: `(${0})`,
              type: 'dashed',
              size: edgeSize,
              color: edgeFake
            });
          }

          count += 1;
        });
        node += count;
      });
      setGraph(g);
    };

  return (
    <div>
      {graph && (
        <Sigma
          renderer="canvas"
          style={{ maxWidth: 'inherit', height: 500 , paddingRight: '100%'}}
          graph={graph}
          settings={settings}
        >
          <EdgeShapes default={'arrow'}/>
            <RelativeSize initialSize={8}/>
        </Sigma>
      )}
    </div>
  );
}
