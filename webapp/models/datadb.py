#from sqlalchemy.ext.associationproxy import association_proxy

from . import db

class Sessions(db.Model):
    __tablename__ = 'Sessions'

    session_id = db.Column(db.Integer, primary_key=True)
    date_time_utc = db.Column(db.DateTime)
    project = db.Column(db.Text)

    def __init__(self, session_id, date_time_utc, project='null'):
        self.session_id = session_id
        self.date_time_utc = date_time_utc
        self.project = project


class SampleDetails(db.Model):
    __tablename__ = 'SampleDetails'

    session_id = db.Column(db.Integer, db.ForeignKey('Sessions.session_id'), primary_key=True)
    protein_class = db.Column(db.Text)
    molecular_weight = db.Column(db.Integer)
    concentration = db.Column(db.Float)
    buffer_desc = db.Column(db.Text)
    buffer_conc = db.Column(db.Integer)
    detergent_type = db.Column(db.Text)
    detergent_conc = db.Column(db.Float)
    glycerol_conc = db.Column(db.Integer)

    def __init__(self, session_id, protein_class, molecular_weight, concentration, buffer_desc, buffer_conc, detergent_type, detergent_conc, glycerol_conc):
        self.session_id = session_id
        self.protein_class = protein_class
        self.molecular_weight = molecular_weight
        self.concentration = concentration
        self.buffer_desc = buffer_desc
        self.buffer_conc = buffer_conc
        self.detergent_type = detergent_type
        self.detergent_conc = detergent_conc
        self.glycerol_conc = glycerol_conc


class Operations(db.Model):
    __tablename__ = 'Operations'

    operation_id = db.Column(db.Integer, primary_key=True)
    operation_time = db.Column(db.DateTime)
    grid_id = db.Column(db.Integer, primary_key=True)
    sample_details_id = db.Column(db.Integer, db.ForeignKey('SampleDetails.session_id'))

    def __init__(self, operation_id, operation_time, grid_id, sample_details_id):
        self.operation_id = operation_id
        self.operation_time = operation_time
        self.grid_id = grid_id
        self.sample_details_id = sample_details_id


class Plunges(db.Model):
    __tablename__ = 'Plunges'

    operation_id = db.Column(db.Integer, db.ForeignKey('Operations.operation_id'), primary_key=True)
    wicking_time_used = db.Column(db.Time)
    plunge_mode = db.Column(db.Integer)

    def __init__(self, operation_id, wicking_time_used, plunge_mode):
        self.operation_id = operation_id
        self.wicking_time_used = wicking_time_used
        self.plunge_mode = plunge_mode


class Treatments(db.Model):
    __tablename__ = 'Treatments'

    grid_id = db.Column(db.Integer, db.ForeignKey('Operations.grid_id'), primary_key=True)
    glow_discharge_id = db.Column(db.Integer)

    def __init__(self, grid_id, glow_discharge_id):
        self.grid_id = grid_id
        self.glow_discharge_id = glow_discharge_id


class Dispenses(db.Model):
    __tablename__ = 'Dispenses'

    operation_id = db.Column(db.Integer, db.ForeignKey('Operations.operation_id'), primary_key=True)
    sample_timer = db.Column(db.Time)

    def __init__(self, operation_id, sample_timer):
        self.operation_id = operation_id
        self.sample_timer = sample_timer


class Grids(db.Model):
    __tablename__ = 'Grids'

    grid_id = db.Column(db.Integer, db.ForeignKey('Operations.grid_id'), primary_key=True)

    def __init__(self, grid_id):
        self.grid_id = grid_id

