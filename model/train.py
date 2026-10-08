import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# =========================
# 1. SETTINGS
# =========================

DATASET_PATH = "PlantVillageDataset/plantvillage dataset/color"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10

# =========================
# 2. LOAD DATASET
# =========================

train_data = tf.keras.utils.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

validation_data = tf.keras.utils.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_data.class_names
num_classes = len(class_names)

print("\nClasses:")
print(class_names)

print("\nNumber of classes:", num_classes)

# =========================
# 3. DATA AUGMENTATION
# =========================

data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

# =========================
# 4. PRETRAINED MODEL
# =========================

base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze pretrained layers
base_model.trainable = False

# =========================
# 5. BUILD MODEL
# =========================

inputs = layers.Input(shape=(224, 224, 3))

x = data_augmentation(inputs)

x = tf.keras.applications.mobilenet_v2.preprocess_input(x)

x = base_model(x, training=False)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(0.2)(x)

outputs = layers.Dense(num_classes, activation="softmax")(x)

model = models.Model(inputs, outputs)

# =========================
# 6. COMPILE
# =========================

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# =========================
# 7. CALLBACKS
# =========================

early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=3,
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    "plant_disease_model.keras",
    monitor="val_accuracy",
    save_best_only=True
)

# =========================
# 8. TRAIN MODEL
# =========================

print("\nStarting training...\n")

history = model.fit(
    train_data,
    validation_data=validation_data,
    epochs=EPOCHS,
    callbacks=[early_stopping, checkpoint]
)

# =========================
# 9. SAVE CLASS NAMES
# =========================

with open("class_names.txt", "w") as f:
    for class_name in class_names:
        f.write(class_name + "\n")

print("\nTraining completed!")
print("Model saved as: plant_disease_model.keras")
print("Classes saved as: class_names.txt")