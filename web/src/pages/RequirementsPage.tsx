import { createLogger } from "../utils/logger";
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Box, Button, CircularProgress, Container, Divider, MenuItem, Select, TextField, Typography } from '@mui/material';
import styled from 'styled-components';
import { CategoryGroup, fetchProductsByCategory, ProductItem, submitBulkOrder } from '../services/requirementsApi';
import { ListLineSuggestion, ListSuggestResponse, suggestFromListImage } from '../services/aiApi';
const __ykLog = createLogger("RequirementsPage");
const Page = styled(Box)`
  padding: 32px 0 96px;
  min-height: 70vh;
  background:
    radial-gradient(circle at top left, rgba(255, 153, 0, 0.12), transparent 40%),
    linear-gradient(180deg, #f7f4ef 0%, #f0ebe3 100%);
`;
const CategoryBlock = styled(Box)`
  margin-bottom: 28px;
`;
const Row = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(35, 47, 62, 0.08);

  @media (max-width: 600px) {
    grid-template-columns: 1fr 110px;
    gap: 8px;
  }
`;
const StickyBar = styled(Box)`
  position: sticky;
  bottom: 0;
  margin-top: 24px;
  padding: 16px 20px;
  background: rgba(35, 47, 62, 0.96);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;
type QtyMap = Record<number, number>;
type SelectedMatch = Record<number, number>;
function RequirementsPage() {
  __ykLog.info("FLOW_ENTER", {
    op: "RequirementsPage.RequirementsPage"
  });
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const user = useSelector((state: any) => state.auth.user);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [quantities, setQuantities] = useState<QtyMap>({});
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiHint, setAiHint] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<ListSuggestResponse | null>(null);
  const [lineSelections, setLineSelections] = useState<SelectedMatch>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        loadProducts();
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, []);
  const loadProducts = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.loadProducts"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.loadProducts";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        setLoading(true);
        setError('');
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsPage#try1"
          });
          const data = await fetchProductsByCategory();
          setGroups(data);
          __ykLog.info("BLOCK_END", {
            op: "RequirementsPage#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (err) {
          setError('Could not load requirements catalog.');
        } finally {
          setLoading(false);
        }
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.loadProducts",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const selectedCount = useMemo(() => Object.values(quantities).filter(q => q > 0).length, [quantities]);
  const estimatedTotal = useMemo(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        let total = 0;
        for (const group of groups) {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsPage#forof1"
          });
          try {
            for (const item of group.items) {
              const __ykBlockStart2 = Date.now();
              __ykLog.info("BLOCK_START", {
                op: "RequirementsPage#forof2"
              });
              try {
                const qty = quantities[item.id] || 0;
                if (qty > 0) total += Number(item.price) * qty;
              } finally {
                __ykLog.info("BLOCK_END", {
                  op: "RequirementsPage#forof2",
                  durationMs: Date.now() - __ykBlockStart2
                });
              }
            }
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "RequirementsPage#forof1",
              durationMs: Date.now() - __ykBlockStart1
            });
          }
        }
        return total;
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, [groups, quantities]);
  const setQty = (productId: number, value: number) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.setQty"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.setQty";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        setQuantities(prev => ({
          ...prev,
          [productId]: Math.max(0, value)
        }));
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.setQty",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const handleSubmit = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.handleSubmit"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.handleSubmit";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        if (!isLoggedIn || !user?.id) {
          const __ykBlockStart3 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsPage#if3"
          });
          try {
            navigate('/login');
            return;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "RequirementsPage#if3",
              durationMs: Date.now() - __ykBlockStart3
            });
          }
        }
        const items = groups.flatMap(group => group.items.filter(item => (quantities[item.id] || 0) > 0).map(item => ({
          productId: item.id,
          productName: item.name,
          brand: item.brand,
          unitPrice: Number(item.price),
          quantity: quantities[item.id]
        })));
        if (items.length === 0) {
          const __ykBlockStart4 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsPage#if4"
          });
          try {
            setError('Enter quantity for at least one item.');
            return;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "RequirementsPage#if4",
              durationMs: Date.now() - __ykBlockStart4
            });
          }
        }
        setSubmitting(true);
        setError('');
        setSuccess('');
        try {
          const __ykBlockStart2 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsPage#try2"
          });
          await submitBulkOrder({
            userId: user.id,
            shippingAddress: shippingAddress || user.address || 'Site delivery',
            paymentMethod: 'COD',
            items
          });
          setSuccess('Requirements order submitted successfully.');
          setQuantities({});
          navigate('/orders');
          __ykLog.info("BLOCK_END", {
            op: "RequirementsPage#try2",
            durationMs: Date.now() - __ykBlockStart2
          });
        } catch (err: any) {
          setError(err.message || 'Failed to submit order.');
        } finally {
          setSubmitting(false);
        }
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.handleSubmit",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const handleFile = async (file: File | null) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.handleFile"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.handleFile";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        if (!file) return;
        setAiLoading(true);
        setError('');
        setAiResult(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        try {
          const result = await suggestFromListImage(file, aiHint || undefined, file.name);
          setAiResult(result);
          const defaults: SelectedMatch = {};
          result.lines.forEach((_, index) => {
            const __ykStart = Date.now();
            __ykLog.info("FLOW_ENTER", {
              op: "RequirementsPage.fn"
            });
            try {
              const __ykStart = Date.now();
              const __ykOp = "RequirementsPage.arrow";
              __ykLog.info("METHOD_START", {
                op: __ykOp
              });
              let __ykOk = true;
              try {
                defaults[index] = 0;
              } catch (__ykErr) {
                __ykOk = false;
                __ykLog.error("METHOD_END", {
                  op: __ykOp,
                  status: "failure",
                  durationMs: Date.now() - __ykStart
                });
                throw __ykErr;
              } finally {
                if (__ykOk) __ykLog.info("METHOD_END", {
                  op: __ykOp,
                  status: "success",
                  durationMs: Date.now() - __ykStart
                });
              }
            } finally {
              __ykLog.info("FLOW_EXIT", {
                op: "RequirementsPage.fn",
                durationMs: Date.now() - __ykStart
              });
            }
          });
          setLineSelections(defaults);
        } catch (err: any) {
          setError(err.message || 'AI could not read the handwritten list.');
        } finally {
          setAiLoading(false);
        }
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.handleFile",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const applyAiMatches = () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.applyAiMatches"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.applyAiMatches";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        if (!aiResult) return;
        const next = {
          ...quantities
        };
        aiResult.lines.forEach((line, index) => {
          const __ykStart = Date.now();
          __ykLog.info("FLOW_ENTER", {
            op: "RequirementsPage.fn"
          });
          try {
            const __ykStart = Date.now();
            const __ykOp = "RequirementsPage.arrow";
            __ykLog.info("METHOD_START", {
              op: __ykOp
            });
            let __ykOk = true;
            try {
              const suggestionIndex = lineSelections[index] ?? 0;
              const suggestion = line.suggestions?.[suggestionIndex];
              if (!suggestion) return;
              const qty = line.quantity && line.quantity > 0 ? Math.round(line.quantity) : 1;
              next[suggestion.id] = (next[suggestion.id] || 0) + qty;
            } catch (__ykErr) {
              __ykOk = false;
              __ykLog.error("METHOD_END", {
                op: __ykOp,
                status: "failure",
                durationMs: Date.now() - __ykStart
              });
              throw __ykErr;
            } finally {
              if (__ykOk) __ykLog.info("METHOD_END", {
                op: __ykOp,
                status: "success",
                durationMs: Date.now() - __ykStart
              });
            }
          } finally {
            __ykLog.info("FLOW_EXIT", {
              op: "RequirementsPage.fn",
              durationMs: Date.now() - __ykStart
            });
          }
        });
        setQuantities(next);
        setSuccess('AI matches applied to the requirements list. Review quantities, then submit.');
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.applyAiMatches",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const findProduct = (id: number): ProductItem | undefined => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsPage.findProduct"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsPage.findProduct";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        for (const group of groups) {
          const __ykBlockStart5 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsPage#forof5"
          });
          try {
            const found = group.items.find(item => item.id === id);
            if (found) return found;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "RequirementsPage#forof5",
              durationMs: Date.now() - __ykBlockStart5
            });
          }
        }
        return undefined;
      } catch (__ykErr) {
        __ykOk = false;
        __ykLog.error("METHOD_END", {
          op: __ykOp,
          status: "failure",
          durationMs: Date.now() - __ykStart
        });
        throw __ykErr;
      } finally {
        if (__ykOk) __ykLog.info("METHOD_END", {
          op: __ykOp,
          status: "success",
          durationMs: Date.now() - __ykStart
        });
      }
    } finally {
      __ykLog.info("FLOW_EXIT", {
        op: "RequirementsPage.findProduct",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  if (loading) {
    const __ykBlockStart6 = Date.now();
    __ykLog.info("BLOCK_START", {
      op: "RequirementsPage#if6"
    });
    try {
      return <Page>
        <Container maxWidth="md" sx={{
          textAlign: 'center',
          py: 8
        }}>
          <CircularProgress />
        </Container>
      </Page>;
    } finally {
      __ykLog.info("BLOCK_END", {
        op: "RequirementsPage#if6",
        durationMs: Date.now() - __ykBlockStart6
      });
    }
  }
  return <Page>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{
        fontWeight: 800,
        color: '#232F3E',
        mb: 1
      }}>
          Requirements
        </Typography>
        <Typography sx={{
        color: '#5c6670',
        mb: 3,
        maxWidth: 640
      }}>
          Fill quantities category-wise. Brand is shown with each item. Submit once to place
          the order for every selected line — or upload a handwritten list in any Indian language.
        </Typography>

        {error && <Alert severity="error" sx={{
        mb: 2
      }} onClose={() => setError('')}>
            {error}
          </Alert>}
        {success && <Alert severity="success" sx={{
        mb: 2
      }} onClose={() => setSuccess('')}>
            {success}
          </Alert>}

        <Box sx={{
        mb: 4,
        p: 2,
        borderTop: '2px solid #FF9900'
      }}>
          <Typography variant="h6" sx={{
          mb: 1,
          fontWeight: 700
        }}>
            Upload handwritten list
          </Typography>
          <Typography sx={{
          mb: 2,
          color: '#5c6670',
          fontSize: 14
        }}>
            Supports Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam,
            Punjabi, Odia, Assamese, Urdu, and mixed English.
          </Typography>
          <TextField fullWidth size="small" label="Optional hint (any Indian language)" value={aiHint} onChange={e => setAiHint(e.target.value)} sx={{
          mb: 2,
          background: 'white'
        }} />
          <Button variant="outlined" component="label" disabled={aiLoading}>
            {aiLoading ? 'Reading list…' : 'Choose photo'}
            <input hidden type="file" accept="image/*" capture="environment" onChange={e => handleFile(e.target.files?.[0] || null)} />
          </Button>
          {previewUrl && <Box sx={{
          mt: 2
        }}>
              <img src={previewUrl} alt="Handwritten list preview" style={{
            maxWidth: '100%',
            maxHeight: 220,
            objectFit: 'contain'
          }} />
            </Box>}
          {aiResult && <Box sx={{
          mt: 2
        }}>
              <Typography sx={{
            mb: 1
          }}>{aiResult.replyMessage}</Typography>
              {aiResult.lines.map((line: ListLineSuggestion, index: number) => <Box key={`${line.rawText}-${index}`} sx={{
            mb: 2
          }}>
                  <Typography sx={{
              fontWeight: 600
            }}>
                    {line.rawText}
                    {line.quantity ? ` · qty ${line.quantity}` : ''}
                  </Typography>
                  {line.suggestions?.length ? <Select size="small" fullWidth value={lineSelections[index] ?? 0} onChange={e => setLineSelections(prev => ({
              ...prev,
              [index]: Number(e.target.value)
            }))} sx={{
              mt: 1,
              background: 'white'
            }}>
                      {line.suggestions.map((suggestion, sIndex) => <MenuItem key={suggestion.id} value={sIndex}>
                          {suggestion.name}
                          {suggestion.brand ? ` · ${suggestion.brand}` : ''}
                          {suggestion.confidence ? ` (${Math.round(suggestion.confidence * 100)}%)` : ''}
                        </MenuItem>)}
                    </Select> : <Typography color="text.secondary">No catalog match</Typography>}
                </Box>)}
              <Button variant="contained" onClick={applyAiMatches}>
                Apply matches to list
              </Button>
            </Box>}
        </Box>

        <TextField fullWidth label="Delivery / site address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} sx={{
        mb: 3,
        background: 'white'
      }} />

        {groups.map(group => <CategoryBlock key={group.category}>
            <Typography variant="h5" sx={{
          fontWeight: 700,
          color: '#232F3E',
          mb: 1
        }}>
              {group.category}
            </Typography>
            <Divider sx={{
          mb: 1
        }} />
            {group.items.map(item => <Row key={item.id}>
                <Box>
                  <Typography sx={{
              fontWeight: 600
            }}>{item.name}</Typography>
                  <Typography sx={{
              color: '#6b7280',
              fontSize: 14
            }}>
                    {item.brand || 'YellowKart'}
                    {item.unit ? ` · ${item.unit}` : ''} · ₹{Number(item.price).toFixed(2)}
                  </Typography>
                </Box>
                <TextField type="number" size="small" label="Qty" inputProps={{
            min: 0
          }} value={quantities[item.id] || 0} onChange={e => setQty(item.id, Number(e.target.value) || 0)} sx={{
            background: 'white'
          }} />
              </Row>)}
          </CategoryBlock>)}

        <StickyBar>
          <Box>
            <Typography sx={{
            fontWeight: 700
          }}>
              {selectedCount} item{selectedCount === 1 ? '' : 's'} · ₹{estimatedTotal.toFixed(2)}
            </Typography>
            <Typography sx={{
            fontSize: 13,
            opacity: 0.85
          }}>
              Only rows with quantity &gt; 0 are ordered
            </Typography>
          </Box>
          <Button variant="contained" color="warning" disabled={submitting || selectedCount === 0} onClick={handleSubmit}>
            {submitting ? 'Submitting…' : 'Submit order'}
          </Button>
        </StickyBar>

        {selectedCount > 0 && <Box sx={{
        mt: 2,
        color: '#5c6670',
        fontSize: 13
      }}>
            Selected:{' '}
            {Object.entries(quantities).filter(([, qty]) => qty > 0).map(([id, qty]) => {
          const __ykStart = Date.now();
          __ykLog.info("FLOW_ENTER", {
            op: "RequirementsPage.fn"
          });
          try {
            const __ykStart = Date.now();
            const __ykOp = "RequirementsPage.arrow";
            __ykLog.info("METHOD_START", {
              op: __ykOp
            });
            let __ykOk = true;
            try {
              const product = findProduct(Number(id));
              return product ? `${product.name}×${qty}` : null;
            } catch (__ykErr) {
              __ykOk = false;
              __ykLog.error("METHOD_END", {
                op: __ykOp,
                status: "failure",
                durationMs: Date.now() - __ykStart
              });
              throw __ykErr;
            } finally {
              if (__ykOk) __ykLog.info("METHOD_END", {
                op: __ykOp,
                status: "success",
                durationMs: Date.now() - __ykStart
              });
            }
          } finally {
            __ykLog.info("FLOW_EXIT", {
              op: "RequirementsPage.fn",
              durationMs: Date.now() - __ykStart
            });
          }
        }).filter(Boolean).join(', ')}
          </Box>}
      </Container>
    </Page>;
}
export default RequirementsPage;