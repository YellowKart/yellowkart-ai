import { createLogger } from "../utils/logger";
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, SectionList, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Modal, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { CategoryGroup, fetchProductsByCategory, submitBulkOrder } from '../services/requirementsApi';
import { ListSuggestResponse, suggestFromListImage } from '../services/aiApi';
const __ykLog = createLogger("RequirementsScreen");
type QtyMap = Record<number, number>;
const RequirementsScreen = ({
  navigation
}: any) => {
  __ykLog.info("FLOW_ENTER", {
    op: "RequirementsScreen.RequirementsScreen"
  });
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const user = useSelector((state: any) => state.auth.user);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [quantities, setQuantities] = useState<QtyMap>({});
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiHint, setAiHint] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<ListSuggestResponse | null>(null);
  const [lineSelections, setLineSelections] = useState<Record<number, number>>({});
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [manualUri, setManualUri] = useState('');
  useEffect(() => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        load();
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
        op: "RequirementsScreen.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, []);
  const load = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.load"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.load";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        setLoading(true);
        try {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsScreen#try1"
          });
          const data = await fetchProductsByCategory();
          setGroups(data);
          __ykLog.info("BLOCK_END", {
            op: "RequirementsScreen#try1",
            durationMs: Date.now() - __ykBlockStart1
          });
        } catch (error) {
          Alert.alert('Error', 'Could not load requirements catalog.');
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
        op: "RequirementsScreen.load",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const sections = useMemo(() => groups.map(group => ({
    title: group.category,
    data: group.items
  })), [groups]);
  const selectedCount = Object.values(quantities).filter(q => q > 0).length;
  const estimatedTotal = groups.reduce((sum, group) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.fn"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.arrow";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        return sum + group.items.reduce((inner, item) => {
          const __ykStart = Date.now();
          __ykLog.info("FLOW_ENTER", {
            op: "RequirementsScreen.fn"
          });
          try {
            const __ykStart = Date.now();
            const __ykOp = "RequirementsScreen.arrow";
            __ykLog.info("METHOD_START", {
              op: __ykOp
            });
            let __ykOk = true;
            try {
              const qty = quantities[item.id] || 0;
              return inner + Number(item.price) * qty;
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
              op: "RequirementsScreen.fn",
              durationMs: Date.now() - __ykStart
            });
          }
        }, 0);
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
        op: "RequirementsScreen.fn",
        durationMs: Date.now() - __ykStart
      });
    }
  }, 0);
  const setQty = (productId: number, value: string) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.setQty"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.setQty";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        const qty = Math.max(0, Number(value) || 0);
        setQuantities(prev => ({
          ...prev,
          [productId]: qty
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
        op: "RequirementsScreen.setQty",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const pickImage = async (fromCamera: boolean) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.pickImage"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.pickImage";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        try {
          const __ykBlockStart2 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsScreen#try2"
          });
          // Optional native module — fall back to URI paste when not linked.
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const ImagePicker = require('react-native-image-picker');
          const result = fromCamera ? await ImagePicker.launchCamera({
            mediaType: 'photo',
            quality: 0.7
          }) : await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            quality: 0.7
          });
          if (result.didCancel || !result.assets?.[0]?.uri) return;
          await analyzeUri(result.assets[0].uri);
          __ykLog.info("BLOCK_END", {
            op: "RequirementsScreen#try2",
            durationMs: Date.now() - __ykBlockStart2
          });
        } catch (error) {
          Alert.alert('Image picker unavailable', 'Paste a local image URI below, or install react-native-image-picker for camera/gallery.');
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
        op: "RequirementsScreen.pickImage",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const analyzeUri = async (uri: string) => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.analyzeUri"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.analyzeUri";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        setAiLoading(true);
        setImageUri(uri);
        try {
          const result = await suggestFromListImage(uri, aiHint || undefined);
          setAiResult(result);
          const defaults: Record<number, number> = {};
          result.lines.forEach((_, index) => {
            const __ykStart = Date.now();
            __ykLog.info("FLOW_ENTER", {
              op: "RequirementsScreen.fn"
            });
            try {
              const __ykStart = Date.now();
              const __ykOp = "RequirementsScreen.arrow";
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
                op: "RequirementsScreen.fn",
                durationMs: Date.now() - __ykStart
              });
            }
          });
          setLineSelections(defaults);
          setReviewOpen(true);
        } catch (error: any) {
          Alert.alert('AI error', error.message || 'Could not read handwritten list');
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
        op: "RequirementsScreen.analyzeUri",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const applyAiMatches = () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.applyAiMatches"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.applyAiMatches";
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
            op: "RequirementsScreen.fn"
          });
          try {
            const __ykStart = Date.now();
            const __ykOp = "RequirementsScreen.arrow";
            __ykLog.info("METHOD_START", {
              op: __ykOp
            });
            let __ykOk = true;
            try {
              const suggestion = line.suggestions?.[lineSelections[index] ?? 0];
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
              op: "RequirementsScreen.fn",
              durationMs: Date.now() - __ykStart
            });
          }
        });
        setQuantities(next);
        setReviewOpen(false);
        Alert.alert('Applied', 'AI matches filled into the requirements list.');
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
        op: "RequirementsScreen.applyAiMatches",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  const handleSubmit = async () => {
    const __ykStart = Date.now();
    __ykLog.info("FLOW_ENTER", {
      op: "RequirementsScreen.handleSubmit"
    });
    try {
      const __ykStart = Date.now();
      const __ykOp = "RequirementsScreen.handleSubmit";
      __ykLog.info("METHOD_START", {
        op: __ykOp
      });
      let __ykOk = true;
      try {
        if (!isLoggedIn || !user?.id) {
          const __ykBlockStart1 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsScreen#if1"
          });
          try {
            navigation.navigate('Login');
            return;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "RequirementsScreen#if1",
              durationMs: Date.now() - __ykBlockStart1
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
        if (!items.length) {
          const __ykBlockStart2 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsScreen#if2"
          });
          try {
            Alert.alert('Nothing selected', 'Enter quantity for at least one item.');
            return;
          } finally {
            __ykLog.info("BLOCK_END", {
              op: "RequirementsScreen#if2",
              durationMs: Date.now() - __ykBlockStart2
            });
          }
        }
        setSubmitting(true);
        try {
          const __ykBlockStart3 = Date.now();
          __ykLog.info("BLOCK_START", {
            op: "RequirementsScreen#try3"
          });
          await submitBulkOrder({
            userId: user.id,
            shippingAddress: shippingAddress || user.address || 'Site delivery',
            paymentMethod: 'COD',
            items
          });
          setQuantities({});
          Alert.alert('Submitted', 'Requirements order placed.');
          navigation.navigate('Orders');
          __ykLog.info("BLOCK_END", {
            op: "RequirementsScreen#try3",
            durationMs: Date.now() - __ykBlockStart3
          });
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to submit order');
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
        op: "RequirementsScreen.handleSubmit",
        durationMs: Date.now() - __ykStart
      });
    }
  };
  if (loading) {
    const __ykBlockStart3 = Date.now();
    __ykLog.info("BLOCK_START", {
      op: "RequirementsScreen#if3"
    });
    try {
      return <View style={styles.center}>
        <ActivityIndicator color="#FF9900" size="large" />
      </View>;
    } finally {
      __ykLog.info("BLOCK_END", {
        op: "RequirementsScreen#if3",
        durationMs: Date.now() - __ykBlockStart3
      });
    }
  }
  return <View style={styles.container}>
      <SectionList sections={sections} keyExtractor={item => String(item.id)} stickySectionHeadersEnabled ListHeaderComponent={<View style={styles.header}>
            <Text style={styles.title}>Requirements</Text>
            <Text style={styles.subtitle}>
              Category-wise list with brand. Fill qty, or upload a handwritten list in any Indian
              language.
            </Text>
            <TextInput style={styles.input} placeholder="Delivery / site address" value={shippingAddress} onChangeText={setShippingAddress} />
            <TextInput style={styles.input} placeholder="Optional AI hint (any Indian language)" value={aiHint} onChangeText={setAiHint} />
            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(true)}>
                <Text style={styles.secondaryBtnText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => pickImage(false)}>
                <Text style={styles.secondaryBtnText}>Gallery</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Or paste image file URI" value={manualUri} onChangeText={setManualUri} />
            <TouchableOpacity style={styles.secondaryBtn} disabled={aiLoading || !manualUri} onPress={() => analyzeUri(manualUri)}>
              <Text style={styles.secondaryBtnText}>
                {aiLoading ? 'Reading…' : 'Analyze URI'}
              </Text>
            </TouchableOpacity>
            {imageUri ? <Image source={{
        uri: imageUri
      }} style={styles.preview} /> : null}
          </View>} renderSectionHeader={({
      section
    }) => <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>} renderItem={({
      item
    }) => <View style={styles.itemRow}>
            <View style={styles.itemMeta}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemBrand}>
                {item.brand || 'YellowKart'}
                {item.unit ? ` · ${item.unit}` : ''} · ₹{Number(item.price).toFixed(2)}
              </Text>
            </View>
            <TextInput style={styles.qtyInput} keyboardType="numeric" value={String(quantities[item.id] || 0)} onChangeText={value => setQty(item.id, value)} />
          </View>} ListFooterComponent={<View style={{
      height: 100
    }} />} />

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>
            {selectedCount} items · ₹{estimatedTotal.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={[styles.primaryBtn, (submitting || selectedCount === 0) && styles.disabled]} disabled={submitting || selectedCount === 0} onPress={handleSubmit}>
          <Text style={styles.primaryBtnText}>{submitting ? 'Submitting…' : 'Submit order'}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={reviewOpen} animationType="slide">
        <ScrollView style={styles.modal}>
          <Text style={styles.title}>Review AI matches</Text>
          <Text style={styles.subtitle}>{aiResult?.replyMessage}</Text>
          {aiResult?.lines.map((line, index) => <View key={`${line.rawText}-${index}`} style={styles.reviewLine}>
              <Text style={styles.itemName}>
                {line.rawText}
                {line.quantity ? ` · qty ${line.quantity}` : ''}
              </Text>
              {line.suggestions?.length ? line.suggestions.map((suggestion, sIndex) => <TouchableOpacity key={suggestion.id} style={[styles.choice, (lineSelections[index] ?? 0) === sIndex && styles.choiceActive]} onPress={() => setLineSelections(prev => ({
            ...prev,
            [index]: sIndex
          }))}>
                    <Text>
                      {suggestion.name}
                      {suggestion.brand ? ` · ${suggestion.brand}` : ''}
                    </Text>
                  </TouchableOpacity>) : <Text style={styles.itemBrand}>No catalog match</Text>}
            </View>)}
          <TouchableOpacity style={styles.primaryBtn} onPress={applyAiMatches}>
            <Text style={styles.primaryBtnText}>Apply to list</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setReviewOpen(false)}>
            <Text style={styles.secondaryBtnText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    padding: 16,
    paddingBottom: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#232F3E',
    marginBottom: 6
  },
  subtitle: {
    color: '#5c6670',
    marginBottom: 12
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  sectionHeader: {
    backgroundColor: '#232F3E',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(35,47,62,0.08)',
    backgroundColor: '#fff'
  },
  itemMeta: {
    flex: 1,
    paddingRight: 12
  },
  itemName: {
    fontWeight: '600',
    color: '#232F3E',
    marginBottom: 2
  },
  itemBrand: {
    color: '#6b7280',
    fontSize: 13
  },
  qtyInput: {
    width: 72,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    textAlign: 'center',
    paddingVertical: 8
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(35,47,62,0.96)',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    color: '#fff',
    fontWeight: '700'
  },
  primaryBtn: {
    backgroundColor: '#FF9900',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8
  },
  primaryBtnText: {
    color: '#111',
    fontWeight: '700'
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF9900',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center'
  },
  secondaryBtnText: {
    color: '#232F3E',
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.5
  },
  preview: {
    width: '100%',
    height: 160,
    marginTop: 8,
    borderRadius: 8
  },
  modal: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F4EF'
  },
  reviewLine: {
    marginBottom: 16
  },
  choice: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  choiceActive: {
    borderColor: '#FF9900',
    backgroundColor: '#FFF7E8'
  }
});
export default RequirementsScreen;