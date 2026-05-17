import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, RefreshCw, Tag, Sliders, X, Zap, Network } from 'lucide-react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { getMemoryGraph, rebuildNoteGraph } from '../lib/api';
import { useToast } from '../components/Toast';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import './GraphPage.css';

export default function GraphPage() {
  const toast = useToast();
  const graphRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [rawData, setRawData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showLabels, setShowLabels] = useState(false);
  const [minStrength, setMinStrength] = useState(0);
  const [rebuilding, setRebuilding] = useState(false);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMemoryGraph();
      setRawData(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load graph');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGraph(); }, [fetchGraph]);

  // Transform raw data into graph format with strength filter
  useEffect(() => {
    const { nodes = [], edges = [] } = rawData;
    const filteredEdges = edges.filter(e => (e.strength || 0) >= minStrength);
    const connCount = {};
    filteredEdges.forEach(e => {
      connCount[e.source] = (connCount[e.source] || 0) + 1;
      connCount[e.target] = (connCount[e.target] || 0) + 1;
    });

    setGraphData({
      nodes: nodes.map(n => ({
        ...n,
        connections: connCount[n.id] || 0,
        val: Math.max(2, (connCount[n.id] || 0) * 3 + 2),
      })),
      links: filteredEdges.map(e => ({
        source: e.source,
        target: e.target,
        strength: e.strength || 0,
        reason: e.reason || '',
      })),
    });
  }, [rawData, minStrength]);

  const handleNodeClick = useCallback((node) => {
    setSelected(node);
    if (graphRef.current) {
      const distance = 120;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
      graphRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        1200
      );
    }
  }, []);

  const handleRecenter = () => {
    if (graphRef.current) {
      graphRef.current.cameraPosition({ x: 0, y: 0, z: 300 }, { x: 0, y: 0, z: 0 }, 1000);
    }
  };

  const handleRebuild = async (noteId) => {
    setRebuilding(true);
    try {
      await rebuildNoteGraph(noteId);
      toast.success('Connections rebuilt');
      await fetchGraph();
    } catch {
      toast.error('Failed to rebuild connections');
    } finally {
      setRebuilding(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  const nodeColor = useCallback((node) => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    return colors[(node.connections || 0) % colors.length];
  }, []);

  const nodeThreeObject = useCallback((node) => {
    if (!showLabels) return undefined;
    const sprite = new SpriteText(node.title || 'Untitled');
    sprite.color = '#ffffff';
    sprite.textHeight = 3;
    sprite.fontFace = 'Inter, sans-serif';
    sprite.position.y = Math.cbrt(node.val || 1) * 4 + 4;
    return sprite;
  }, [showLabels]);

  const hasNodes = rawData.nodes?.length > 0;
  const hasEdges = rawData.edges?.length > 0;

  if (loading) return <LoadingState type="spinner" />;

  if (error) {
    return (
      <EmptyState
        icon={Network}
        title="Could not load graph"
        description={error}
        action={<Button variant="primary" onClick={fetchGraph}>Retry</Button>}
      />
    );
  }

  if (!hasNodes) {
    return (
      <EmptyState
        icon={Network}
        title="Your memory graph is empty"
        description="Create a few related notes to grow your memory graph."
        action={<Button variant="primary" onClick={() => window.location.href = '/app'}>Go to Notes</Button>}
      />
    );
  }

  return (
    <div className="graph-page">
      {/* Controls */}
      <div className="graph-controls glass-strong">
        <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleRecenter}>Recenter</Button>
        <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchGraph}>Refresh</Button>
        <Button variant={showLabels ? 'secondary' : 'ghost'} size="sm" icon={Tag} onClick={() => setShowLabels(!showLabels)}>
          Labels
        </Button>
        <div className="strength-control">
          <Sliders size={14} />
          <span>Min: {minStrength.toFixed(1)}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={minStrength}
            onChange={e => setMinStrength(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* No edges hint */}
      {hasNodes && !hasEdges && (
        <div className="graph-hint glass">
          <Zap size={16} />
          <span>No connections found. Try rebuilding connections on individual notes or lowering the minimum strength.</span>
        </div>
      )}

      {/* Graph canvas */}
      <div className="graph-canvas">
        <ForceGraph3D
          ref={graphRef}
          graphData={graphData}
          backgroundColor="#050a18"
          nodeColor={nodeColor}
          nodeVal="val"
          nodeLabel={n => n.title || 'Untitled'}
          nodeOpacity={0.9}
          nodeResolution={16}
          linkColor={() => 'rgba(59, 130, 246, 0.25)'}
          linkWidth={l => Math.max(0.5, (l.strength || 0) * 3)}
          linkOpacity={0.4}
          onNodeClick={handleNodeClick}
          nodeThreeObject={showLabels ? nodeThreeObject : undefined}
          nodeThreeObjectExtend={showLabels}
          enableNodeDrag
          enableNavigationControls
          showNavInfo={false}
          warmupTicks={50}
          cooldownTicks={100}
        />
      </div>

      {/* Selected node panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="graph-panel glass-strong"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="graph-panel-header">
              <h3>{selected.title || 'Untitled'}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>
            {selected.preview && <p className="graph-panel-preview">{selected.preview}</p>}
            <div className="graph-panel-meta">
              {selected.access && <span className={`note-badge note-badge-${selected.access}`}>{selected.access}</span>}
              <span>{selected.connections || 0} connections</span>
            </div>
            {selected.created_at && <p className="graph-panel-date">Created: {formatDate(selected.created_at)}</p>}
            {selected.updated_at && <p className="graph-panel-date">Updated: {formatDate(selected.updated_at)}</p>}
            <Button
              variant="secondary"
              size="sm"
              icon={Zap}
              loading={rebuilding}
              onClick={() => handleRebuild(selected.id)}
              className="graph-rebuild-btn"
            >
              Rebuild connections
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
